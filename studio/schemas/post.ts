import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title of the blog post',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'The slug for the blog post, tap generate to create a slug from the title',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'A short description of the blog post (optional)',
      rows: 4,
    }),
    defineField({
      name: "tags",
      type: "array",
      description: 'Tags that relate to the post',
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Football", value: "Football" },
          { title: "Athletics", value: "Athletics" },
          { title: "Basketball", value: "Basketball" },
          { title: "Nigeria League", value: "Nigeria League" },
          { title: "Lifestyle", value: "Lifestyle" },
          { title: "Oddities", value: "Oddities" },
          { title: "Other Sports", value: "Other Sports" },
          { title: "Interview", value: "Interview" },
          { title: "Feature", value: "Feature" },
        ],
      },
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      description: "Add keywords that describes your blog post. (max of 10)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      validation: (Rule) => Rule.max(10)
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      description: 'The main image for the blog post',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
