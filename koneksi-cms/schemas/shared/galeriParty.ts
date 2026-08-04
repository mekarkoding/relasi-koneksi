import {defineField} from 'sanity'

export const GALERI_PARTIES = [
  {title: 'Adat Dalem Tamblingan', value: 'adat'},
  {title: 'KKN Mekar Banjar', value: 'kkn'},
] as const

export type GaleriParty = (typeof GALERI_PARTIES)[number]['value']

/** Shared party selector for gallery photos and videos. */
export function galeriPartyField() {
  return defineField({
    name: 'party',
    title: 'Kelompok',
    description: 'Pilih Adat Dalem Tamblingan atau KKN Mekar Banjar.',
    type: 'string',
    options: {
      list: [...GALERI_PARTIES],
      layout: 'radio',
    },
    validation: (rule) => rule.required(),
  })
}
