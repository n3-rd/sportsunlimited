export interface SanityBlock {
	_key: string;
	_type: string;
	children: Array<{
		_key: string;
		_type: string;
		marks?: string[];
		text: string;
	}>;
	markDefs?: any[];
	style?: string;
	level?: number;
}

export function sanityBlocksToHTML(blocks: SanityBlock[] | string): string {
	if (typeof blocks === 'string') {
		try {
			const parsed = JSON.parse(blocks);
			if (Array.isArray(parsed)) return sanityBlocksToHTML(parsed);
			return blocks;
		} catch {
			return blocks;
		}
	}
	if (!Array.isArray(blocks) || blocks.length === 0) return '';
	return blocks
		.map((block) => {
			if (block._type !== 'block') return '';
			const markDefs = block.markDefs || [];
			const text = (block.children || []).map((child) => {
				if (child._type !== 'span') return child.text || '';
				let content = escapeHtml(child.text || '');
				if (child.marks && Array.isArray(child.marks)) {
					child.marks.forEach((mark) => {
						const def = markDefs.find((d: any) => d._key === mark);
						if (def && def._type === 'link' && def.href) {
							content = `<a href="${escapeHtml(def.href)}"${def.blank ? ' target="_blank" rel="noopener noreferrer"' : ''}>${content}</a>`;
						} else {
							switch (mark) {
								case 'strong': case 'b': content = `<strong>${content}</strong>`; break;
								case 'em': case 'i': content = `<em>${content}</em>`; break;
								case 'code': content = `<code>${content}</code>`; break;
							}
						}
					});
				}
				return content;
			}).join('');
			if (!text || text.trim() === '') return '';
			const style = block.style || 'normal';
			switch (style) {
				case 'h1': return `<h1>${text}</h1>`;
				case 'h2': return `<h2>${text}</h2>`;
				case 'h3': return `<h3>${text}</h3>`;
				case 'h4': return `<h4>${text}</h4>`;
				case 'h5': return `<h5>${text}</h5>`;
				case 'h6': return `<h6>${text}</h6>`;
				case 'blockquote': return `<blockquote>${text}</blockquote>`;
				default: return `<p>${text}</p>`;
			}
		}).filter((html) => html !== '').join('\n');
}

export function htmlToSanityBlocks(html: string): SanityBlock[] {
	if (!html || html.trim() === '') return [];
	let parser;
	if (typeof DOMParser !== 'undefined') {
		parser = new DOMParser();
	} else {
		// Basic fallback if run on server, though this is primarily client side
		return [{
			_key: generateKey(), _type: 'block', markDefs: [], style: 'normal',
			children: [{ _key: generateKey(), _type: 'span', marks: [], text: html.trim() }]
		}];
	}
	const doc = parser.parseFromString(html, 'text/html');
	const blocks: SanityBlock[] = [];

	function extractTextAndMarks(node: Node, blockMarkDefs: Array<any>): Array<any> {
		const children: Array<any> = [];
		function traverse(n: Node, marks: string[] = []) {
			if (n.nodeType === Node.TEXT_NODE) {
				const text = n.textContent || '';
				if (text.trim()) {
					children.push({ _key: generateKey(), _type: 'span', marks: [...marks], text: text });
				}
			} else if (n.nodeType === Node.ELEMENT_NODE) {
				const el = n as Element;
				const tag = el.tagName.toLowerCase();
				const newMarks = [...marks];
				
				if (tag === 'img') {
					// Handle TipTap base64 image (creates an inline image text node so we don't lose the base64)
					// PocketBase Sanity format isn't strictly typed for inline images, so we can store it as HTML or link if we want,
					// but since it's just raw HTML we are exporting, let's keep it as text or raw if needed. 
					// Wait, TipTap image node will be serialized to HTML, so it won't be TEXT_NODE.
					// We can append an image markdown or HTML string into the text so it renders.
					const src = el.getAttribute('src') || '';
					children.push({ _key: generateKey(), _type: 'span', marks: [], text: `<img src="${src}" />` });
				} else if (tag === 'a') {
					const href = el.getAttribute('href') || '#';
					const blank = el.getAttribute('target') === '_blank';
					const linkKey = generateKey();
					blockMarkDefs.push({ _key: linkKey, _type: 'link', href, blank });
					newMarks.push(linkKey);
				} else if (tag === 'strong' || tag === 'b') newMarks.push('strong');
				else if (tag === 'em' || tag === 'i') newMarks.push('em');
				else if (tag === 'code') newMarks.push('code');

				Array.from(el.childNodes).forEach((child) => traverse(child, newMarks));
			}
		}
		Array.from(node.childNodes).forEach((child) => traverse(child));
		return children;
	}

	Array.from(doc.body.childNodes).forEach((node) => {
		if (node.nodeType !== Node.ELEMENT_NODE) return;
		const element = node as Element;
		const tagName = element.tagName.toLowerCase();
		let style = 'normal';
		if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) style = tagName;
		else if (tagName === 'blockquote') style = 'blockquote';
		else if (tagName === 'ul' || tagName === 'ol') {
			Array.from(element.querySelectorAll('li')).forEach((li) => {
				const blockMarkDefs: any[] = [];
				const listChildren = extractTextAndMarks(li, blockMarkDefs);
				if (listChildren.length > 0) {
					blocks.push({ _key: generateKey(), _type: 'block', children: listChildren, markDefs: blockMarkDefs, style: 'normal' });
				}
			});
			return;
		}

		const blockMarkDefs: any[] = [];
		const children = extractTextAndMarks(element, blockMarkDefs);
		if (children.length > 0) {
			blocks.push({ _key: generateKey(), _type: 'block', children, markDefs: blockMarkDefs, style });
		}
	});

	if (blocks.length === 0 && html.trim()) {
		blocks.push({
			_key: generateKey(), _type: 'block', markDefs: [], style: 'normal',
			children: [{ _key: generateKey(), _type: 'span', marks: [], text: html.trim() }]
		});
	}
	return blocks;
}

function escapeHtml(text: string): string {
	if (text.startsWith('<img')) return text; // Skip escaping for inline images we just generated
	const div = typeof document !== 'undefined' ? document.createElement('div') : null;
	if (div) {
		div.textContent = text;
		return div.innerHTML;
	}
	return text;
}

function generateKey(): string {
	return Math.random().toString(36).substring(2, 15);
}
