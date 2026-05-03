const JURISDICTIONS = [
  { id: 'all', label: 'All Jurisdictions', type: 'global' },
  { id: 'nl', label: 'Newfoundland and Labrador', type: 'province' },
  { id: 'st-johns', label: 'St. John\'s', type: 'municipality', provinceId: 'nl' },
  { id: 'mount-pearl', label: 'Mount Pearl', type: 'municipality', provinceId: 'nl' },
  { id: 'corner-brook', label: 'Corner Brook', type: 'municipality', provinceId: 'nl' },
  { id: 'paradise', label: 'Paradise', type: 'municipality', provinceId: 'nl' }
];

const TASKS = [
  { id: 'sanitary-loading', label: 'Sanitary Loading' },
  { id: 'swm-pond-sizing', label: 'SWM Pond Sizing' },
  { id: 'roadway-design', label: 'Roadway Design' }
];

const DOCUMENTS = [
  {
    id: 'doc-1',
    title: 'Guidelines for the Design, Construction and Operation of Water and Sewerage Systems',
    publisher: 'Gov NL',
    jurisdiction: ['nl'],
    doc_type: 'provincial guideline',
    url: 'gov.nl.ca → ecc → water resources → PDF',
    license_note: 'public gov doc; cite with attribution',
    description: 'The baseline for municipal water/sanitary/storm works.'
  },
  {
    id: 'doc-2',
    title: 'Development Design Manual',
    publisher: 'City of St. John\'s',
    jurisdiction: ['st-johns'],
    doc_type: 'municipal manual',
    url: 'stjohns.ca → Building & Development → PDF',
    sections: ['Division 6 – Stormwater'],
    license_note: 'public gov doc; cite with attribution',
    description: 'Full manual; Division 6 covers Stormwater.'
  },
  {
    id: 'doc-3',
    title: 'Stormwater Management Policy 08-04-20',
    publisher: 'City of St. John\'s',
    jurisdiction: ['st-johns'],
    doc_type: 'policy',
    url: 'apps.stjohns.ca/policies… → PDF',
    license_note: 'public gov doc; cite with attribution',
    description: 'Detention/"pre = post" policy; complements the manual.'
  },
  {
    id: 'doc-4',
    title: 'Residential Subdivision Development Standards',
    publisher: 'City of Mount Pearl',
    jurisdiction: ['mount-pearl'],
    doc_type: 'municipal manual',
    url: 'mountpearl.ca → PDF',
    license_note: 'public gov doc; cite with attribution',
    description: 'Storm sewer piping, detention.'
  },
  {
    id: 'doc-5',
    title: 'Subdivision Design Procedures & Municipal Engineering Standards',
    publisher: 'City of Corner Brook',
    jurisdiction: ['corner-brook'],
    doc_type: 'municipal manual',
    sections: ['Section 4: Storm Sewers', 'test schedules'],
    url: 'cornerbrook.com → PDF',
    license_note: 'public gov doc; cite with attribution',
    description: 'Section 4 details storm sewers.'
  },
  {
    id: 'doc-6',
    title: 'Storm Water Management Plan (2019/2020)',
    publisher: 'Town of Paradise',
    jurisdiction: ['paradise'],
    doc_type: 'policy',
    url: 'paradise.ca → PDF',
    license_note: 'public gov doc; cite with attribution',
    description: 'Zero-net-increase context; good reference.'
  }
];

const SUPPORTING_DOCS = [
  {
    id: 'sup-1',
    title: 'NL Environmental Control Water & Sewage Regulations, 2003',
    publisher: 'Gov NL',
    doc_type: 'regulation',
    jurisdiction: ['nl']
  },
  {
    id: 'sup-2',
    title: 'Envision Development Regulations',
    publisher: 'City of St. John\'s',
    doc_type: 'regulation',
    jurisdiction: ['st-johns']
  },
  {
    id: 'sup-3',
    title: 'Construction Specifications (2022)',
    publisher: 'City of St. John\'s',
    doc_type: 'municipal manual',
    jurisdiction: ['st-johns']
  }
];

const REFERENCE_STANDARDS = [
  { id: 'ref-1', title: 'CSA B182', publisher: 'CSA' },
  { id: 'ref-2', title: 'CSA A257', publisher: 'CSA' },
  { id: 'ref-3', title: 'AWWA C900', publisher: 'AWWA' }
];

export { JURISDICTIONS, TASKS, DOCUMENTS, SUPPORTING_DOCS, REFERENCE_STANDARDS };
