import { prepareSpace } from '../prepare'
import { credentialsFromEnvironment } from '../credentialsFromEnvironment'
import { ContentStory } from '@johannes-lindgren/storyblok-migrations'
import { components } from 'astro-app-components'
import { ContentFromLibrary } from '@johannes-lindgren/storyblok'

const initialStories: Omit<ContentStory, 'id' | 'uuid'>[] = [
  {
    is_folder: false,
    name: 'Rich Text Demo',
    slug: 'rich-text-demo',
    content: {
      component: 'article',
      _uid: 'abc-123',
      title: 'Rich Text Demo',
      body: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: {
              level: 1,
            },
            content: [
              {
                text: 'Custom Renderer for ',
                type: 'text',
                marks: [],
              },
              {
                text: 'Rich Text',
                type: 'text',
                marks: [
                  {
                    type: 'styled',
                    attrs: {
                      class: 'gradient',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                text: 'This is a demo on how to create a customized renderer for rich text.',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'heading',
            attrs: {
              level: 2,
            },
            content: [
              {
                text: 'Lorem Ipsum',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec iaculis dui sed tincidunt efficitur. Vestibulum maximus metus eget lorem faucibus blandit. Nunc vitae magna luctus, luctus eros placerat, elementum eros. Morbi arcu libero, dictum non molestie at, sodales sed mauris. Sed id magna justo. Sed gravida pharetra sem, vel ornare nisi. Sed scelerisque enim non eros faucibus fermentum. Praesent varius massa in lacus posuere euismod. Sed sem odio, mattis eu tristique id, efficitur in tortor. Integer mollis eros in lacus condimentum, sit amet rutrum massa dignissim.',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                text: 'Nam nec lorem justo. Nulla lobortis elit diam, at feugiat magna fermentum ut. Mauris vestibulum blandit elit, a blandit erat ornare nec. Vivamus tempus lorem eget rutrum cursus. Morbi in gravida nibh, eu fringilla mauris. Pellentesque lorem lectus, vestibulum non lorem interdum, tempus mollis orci. Nulla varius, nisl a sollicitudin fermentum, purus libero tempor nisi, eget aliquet mauris odio eu felis. Nunc porttitor rhoncus vulputate. Praesent commodo lectus augue, eget sagittis orci posuere eget. Proin at luctus eros. Praesent lacus quam, tempor sed convallis vitae, bibendum vel libero. Donec feugiat vitae lorem at gravida. Sed quis consequat metus, volutpat rhoncus odio.',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                text: 'Curabitur non nisi nec diam interdum ullamcorper. Mauris dictum ligula sit amet augue rhoncus mollis. Nullam molestie scelerisque erat, id pretium elit tristique eget. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce nec sapien facilisis odio lobortis imperdiet. Integer accumsan elit nec nisl ultricies, et sodales metus tincidunt. Phasellus rutrum iaculis nunc et finibus. Nullam sit amet nulla sit amet nisi consequat laoreet ut non justo. Mauris ultrices metus nec justo luctus, at tempus nulla pharetra. Duis lacinia porta dapibus. Nulla suscipit dictum nulla aliquam porta. Aenean ornare nulla non massa dictum, ac accumsan ipsum sollicitudin. Quisque in leo non mauris efficitur auctor.',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'heading',
            attrs: {
              level: 2,
            },
            content: [
              {
                text: 'Lists',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                text: 'You can render unordered lists:',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'bullet_list',
            content: [
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'a ',
                        type: 'text',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'bullet',
                        type: 'text',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'list',
                        type: 'text',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                text: 'You can render ordered lists:',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'ordered_list',
            content: [
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'An',
                        type: 'text',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'ordered',
                        type: 'text',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'list',
                        type: 'text',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'heading',
            attrs: {
              level: 2,
            },
            content: [
              {
                text: 'Quotes',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    text: 'Hello, this is a quote',
                    type: 'text',
                    marks: [],
                  },
                ],
              },
            ],
          },
          {
            type: 'heading',
            attrs: {
              level: 2,
            },
            content: [
              {
                text: 'Marks',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                text: 'There are different ways to style text:',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'bullet_list',
            content: [
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'Bold',
                        type: 'text',
                        marks: [
                          {
                            type: 'bold',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'Italic',
                        type: 'text',
                        marks: [
                          {
                            type: 'italic',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'mc',
                        type: 'text',
                        marks: [],
                      },
                      {
                        text: '2',
                        type: 'text',
                        marks: [
                          {
                            type: 'superscript',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'H',
                        type: 'text',
                        marks: [],
                      },
                      {
                        text: '2',
                        type: 'text',
                        marks: [
                          {
                            type: 'subscript',
                          },
                        ],
                      },
                      {
                        text: 'O',
                        type: 'text',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'Strike',
                        type: 'text',
                        marks: [
                          {
                            type: 'strike',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'Under',
                        type: 'text',
                        marks: [
                          {
                            type: 'underline',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'highlight',
                        type: 'text',
                        marks: [
                          {
                            type: 'highlight',
                            attrs: {
                              color: '#FDAF00',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'text color',
                        type: 'text',
                        marks: [
                          {
                            type: 'textStyle',
                            attrs: {
                              color: '#E90000',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: "def a = 'aaa'",
                        type: 'text',
                        marks: [
                          {
                            type: 'code',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'Combined',
                        type: 'text',
                        marks: [
                          {
                            type: 'bold',
                          },
                          {
                            type: 'italic',
                          },
                          {
                            type: 'underline',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'heading',
            attrs: {
              level: 2,
            },
            content: [
              {
                text: 'Divider',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                text: 'You can insert horizontal rules:',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'horizontal_rule',
          },
          {
            type: 'paragraph',
            content: [
              {
                text: 'See!',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'heading',
            attrs: {
              level: 2,
            },
            content: [
              {
                text: 'Images',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'image',
                attrs: {
                  id: 18393881,
                  alt: '',
                  src: 'https://a.storyblok.com/f/312650/571x654/6868f71220/logo.png',
                  title: '',
                  source: '',
                  copyright: '',
                },
              },
            ],
          },
          {
            type: 'heading',
            attrs: {
              level: 2,
            },
            content: [
              {
                text: 'Code Block',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                text: 'You can write code',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'code_block',
            content: [
              {
                text: 'def r = 2\ndef pi = 3.14159\ndef A = A * (r ** 2)',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'heading',
            attrs: {
              level: 2,
            },
            content: [
              {
                text: 'Links',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'bullet_list',
            content: [
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'URL Link',
                        type: 'text',
                        marks: [
                          {
                            type: 'link',
                            attrs: {
                              href: 'https://duck.com',
                              linktype: 'url',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'Story Link',
                        type: 'text',
                        marks: [
                          {
                            type: 'link',
                            attrs: {
                              href: '/a-new-story',
                              uuid: 'bfaa3aa6-65d1-441d-991e-0a8dff686ac5',
                              linktype: 'story',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'Email Link',
                        type: 'text',
                        marks: [
                          {
                            type: 'link',
                            attrs: {
                              href: 'test@test.com',
                              linktype: 'email',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'list_item',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        text: 'Image Link',
                        type: 'text',
                        marks: [
                          {
                            type: 'link',
                            attrs: {
                              href: 'https://a.storyblok.com/f/312650/571x654/6868f71220/logo.png',
                              linktype: 'asset',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'heading',
            attrs: {
              level: 2,
            },
            content: [
              {
                text: 'Nested Block',
                type: 'text',
                marks: [],
              },
            ],
          },
          {
            type: 'blok',
            attrs: {
              id: '5192809b-dbcb-410e-b343-e725f1ac72ab',
              body: [
                {
                  _uid: 'i-bf53319f-9fd6-465c-b753-0cfe00a836a8',
                  body: {
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            text: 'This is an admonition',
                            type: 'text',
                          },
                        ],
                      },
                    ],
                  },
                  type: 'info',
                  component: 'admonition',
                },
                {
                  _uid: 'i-863fd702-769e-4b5f-a2d2-1a655b56b778',
                  body: {
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            text: 'This is an admonition',
                            type: 'text',
                          },
                        ],
                      },
                    ],
                  },
                  type: 'tip',
                  component: 'admonition',
                },
                {
                  _uid: 'i-ffc3d5ae-a5c1-40ce-a792-251a849c1460',
                  body: {
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            text: 'This is an admonition',
                            type: 'text',
                          },
                        ],
                      },
                    ],
                  },
                  type: 'warning',
                  component: 'admonition',
                },
                {
                  _uid: 'i-097bb7d4-d3b0-4fd1-bac0-93ad0c6e05bd',
                  body: {
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            text: 'This is an admonition',
                            type: 'text',
                          },
                        ],
                      },
                    ],
                  },
                  type: 'danger',
                  component: 'admonition',
                },
              ],
            },
          },
        ],
      },
    } satisfies ContentFromLibrary<typeof components>,
    parent_id: 0,
    is_startpage: false,
  },
]

await prepareSpace(credentialsFromEnvironment(), components, initialStories)
