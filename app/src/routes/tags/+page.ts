import { getTags } from "$lib/utils/sanity";
import type { PageLoad } from "../$types";

export const load:PageLoad = async () => {
    let tags = await getTags();
    const tagCounts = new Map<string, number>();

    // Count the number of times each tag is shown
    tags.forEach(tag => {
        if (tagCounts.has(tag)) {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        } else {
            tagCounts.set(tag, 1);
        }
    });

    // Remove duplicates
    tags = [...new Set(tags)];

    return {
        tags,
        tagCounts
    }
}
