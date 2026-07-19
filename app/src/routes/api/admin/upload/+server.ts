import { json } from '@sveltejs/kit';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!(file instanceof File)) {
			return json({ error: 'No file uploaded' }, { status: 400 });
		}

		const uploadsDir = path.join(process.cwd(), 'static', 'uploads');
		await fs.mkdir(uploadsDir, { recursive: true });

		const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
		const filePath = path.join(uploadsDir, filename);

		const buffer = Buffer.from(await file.arrayBuffer());
		await fs.writeFile(filePath, buffer);

		return json({ url: `/uploads/${filename}` });
	} catch (e) {
		console.error('Upload error:', e);
		return json({ error: 'Failed to upload file' }, { status: 500 });
	}
}
