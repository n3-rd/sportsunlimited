export function formatDate(date: string) {
	return new Date(date).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

export function truncateText(text: string, maxLength: number) {
	if (text.length > maxLength) {
		return text.substring(0, maxLength) + '...';
	}
	return text;
}

/**
 * Calculate reading time in minutes based on word count
 * Average reading speed: 200-250 words per minute
 */
export function calculateReadingTime(content: any[]): number {
	if (!content || !Array.isArray(content)) return 1;
	
	let wordCount = 0;
	
	// Extract text from PortableText blocks
	content.forEach((block: any) => {
		if (block._type === 'block' && block.children) {
			block.children.forEach((child: any) => {
				if (child.text) {
					const words = child.text.trim().split(/\s+/).filter((word: string) => word.length > 0);
					wordCount += words.length;
				}
			});
		}
	});
	
	// Average reading speed: 225 words per minute
	const readingTime = Math.ceil(wordCount / 225);
	return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Get word count from PortableText content
 */
export function getWordCount(content: any[]): number {
	if (!content || !Array.isArray(content)) return 0;
	
	let wordCount = 0;
	
	content.forEach((block: any) => {
		if (block._type === 'block' && block.children) {
			block.children.forEach((child: any) => {
				if (child.text) {
					const words = child.text.trim().split(/\s+/).filter((word: string) => word.length > 0);
					wordCount += words.length;
				}
			});
		}
	});
	
	return wordCount;
}