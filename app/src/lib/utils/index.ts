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