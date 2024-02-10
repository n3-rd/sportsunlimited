import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'
import {tags} from 'sanity-plugin-tags'

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID!
export const dataset = process.env.SANITY_STUDIO_DATASET!

const tagConfig = {
  // create a sanity tag plugin config
  predefinedTags: [
    {label: 'Basketball', value: 'basketball'},
    {label: 'Football', value: 'football'},
    {label: 'Other Sports', value: 'other-sports'},
  ]
}

export default defineConfig({
  name: 'project-name',
  title: 'Project Name',
  projectId,
  dataset,
  plugins: [deskTool(), visionTool(), tags(tagConfig)],
  schema: {
    types: schemaTypes,
  },
})