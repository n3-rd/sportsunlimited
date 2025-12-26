/**
 * Utilities for converting between Sanity block format and HTML
 */

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

/**
 * Convert Sanity blocks to HTML
 */
export function sanityBlocksToHTML(blocks: SanityBlock[] | string): string {
	if (typeof blocks === 'string') {
		// If it's already a string, try to parse as JSON
		try {
			const parsed = JSON.parse(blocks);
			if (Array.isArray(parsed)) {
				return sanityBlocksToHTML(parsed);
			}
			return blocks;
		} catch {
			return blocks;
		}
	}

	if (!Array.isArray(blocks) || blocks.length === 0) {
		return '';
	}

	return blocks
		.map((block) => {
			if (block._type !== 'block') {
				return '';
			}

			// Handle children array - combine all text from children
			const text = (block.children || [])
				.map((child) => {
					if (child._type !== 'span') {
						return child.text || '';
					}
					
					let content = escapeHtml(child.text || '');
					// Apply marks (bold, italic, etc.)
					if (child.marks && Array.isArray(child.marks)) {
						child.marks.forEach((mark) => {
							switch (mark) {
								case 'strong':
								case 'b':
									content = `<strong>${content}</strong>`;
									break;
								case 'em':
								case 'i':
									content = `<em>${content}</em>`;
									break;
								case 'code':
									content = `<code>${content}</code>`;
									break;
							}
						});
					}
					return content;
				})
				.join('');

			// If no text, return empty
			if (!text || text.trim() === '') {
				return '';
			}

			const style = block.style || 'normal';
			switch (style) {
				case 'h1':
					return `<h1>${text}</h1>`;
				case 'h2':
					return `<h2>${text}</h2>`;
				case 'h3':
					return `<h3>${text}</h3>`;
				case 'h4':
					return `<h4>${text}</h4>`;
				case 'h5':
					return `<h5>${text}</h5>`;
				case 'h6':
					return `<h6>${text}</h6>`;
				case 'blockquote':
					return `<blockquote>${text}</blockquote>`;
				default:
					return `<p>${text}</p>`;
			}
		})
		.filter((html) => html !== '') // Remove empty blocks
		.join('\n');
}

/**
 * Convert HTML to Sanity blocks
 */
export function htmlToSanityBlocks(html: string): SanityBlock[] {
	if (!html || html.trim() === '') {
		return [];
	}

	// Parse HTML
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const blocks: SanityBlock[] = [];

	function extractTextAndMarks(node: Node): Array<{ _key: string; _type: string; marks: string[]; text: string }> {
		const children: Array<{ _key: string; _type: string; marks: string[]; text: string }> = [];

		function traverse(n: Node, marks: string[] = []) {
			if (n.nodeType === Node.TEXT_NODE) {
				const text = n.textContent || '';
				if (text.trim()) {
					children.push({
						_key: generateKey(),
						_type: 'span',
						marks: [...marks],
						text: text
					});
				}
			} else if (n.nodeType === Node.ELEMENT_NODE) {
				const el = n as Element;
				const tag = el.tagName.toLowerCase();
				const newMarks = [...marks];

				if (tag === 'strong' || tag === 'b') {
					newMarks.push('strong');
				} else if (tag === 'em' || tag === 'i') {
					newMarks.push('em');
				} else if (tag === 'code') {
					newMarks.push('code');
				}

				Array.from(el.childNodes).forEach((child) => traverse(child, newMarks));
			}
		}

		Array.from(node.childNodes).forEach((child) => traverse(child));
		return children;
	}

	// Process each top-level element in body
	Array.from(doc.body.childNodes).forEach((node) => {
		if (node.nodeType !== Node.ELEMENT_NODE) {
			return;
		}

		const element = node as Element;
		const tagName = element.tagName.toLowerCase();

		// Determine block style
		let style = 'normal';
		if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
			style = tagName;
		} else if (tagName === 'blockquote') {
			style = 'blockquote';
		} else if (tagName === 'ul' || tagName === 'ol') {
			// Handle lists - each list item becomes a block
			Array.from(element.querySelectorAll('li')).forEach((li) => {
				const children = extractTextAndMarks(li);
				if (children.length > 0) {
					blocks.push({
						_key: generateKey(),
						_type: 'block',
						children,
						markDefs: [],
						style: 'normal'
					});
				}
			});
			return;
		}

		const children = extractTextAndMarks(element);
		if (children.length > 0) {
			blocks.push({
				_key: generateKey(),
				_type: 'block',
				children,
				markDefs: [],
				style
			});
		}
	});

	// If no blocks were created, create one from plain text
	if (blocks.length === 0 && html.trim()) {
		blocks.push({
			_key: generateKey(),
			_type: 'block',
			children: [
				{
					_key: generateKey(),
					_type: 'span',
					marks: [],
					text: html.trim()
				}
			],
			markDefs: [],
			style: 'normal'
		});
	}

	return blocks;
}

function escapeHtml(text: string): string {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

function generateKey(): string {
	return Math.random().toString(36).substring(2, 15);
}

