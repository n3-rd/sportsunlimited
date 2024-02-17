import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'
import {tags} from 'sanity-plugin-tags'
import { autocompletInput } from "sanity-plugin-autocomplete-input";

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
  name: 'Sports_Unlimited',
  title: 'Sports Unlimited Studio',
  projectId,
  dataset,
  plugins: [deskTool(), visionTool(), tags(tagConfig), autocompletInput()],
  schema: {
    types: schemaTypes,
  },
})