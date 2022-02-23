# @johannes-lindgren/storyblok-js

A typed library for Storyblok!


## Content Delivery Client

While the [storyblok-js-client](https://github.com/storyblok/storyblok-js-client) provides a lot of great functionality, it lacks support for types. `@johannes-lindgren/storyblok-js` solves this issue.

> :information_source: The types will be useful even if you don't use typescript.

Create a new client:

```javascript
const client = new ContentDeliveryClient(myToken)
```

Fetch content with

```javascript
await client.getStory(slugs)
```

Choose language:

```javascript
await client.getStory(slugs, { language: 'en' })
```

Fetch draft:

```javascript
await client.getStory(slugs, { version: 'draft' })
```

Get [links](https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/links/links):

```javascript
await client.getLinks({ starts_with: '/dir/subdir/my-content' })
```

## Typescript


### Content types

Define your content types with the `Block` utility type:

```typescript
import {Block} from "@johannes-lindgren/storyblok-js";

type Article = Block<{
    title: string
    text: string
}>
```

The `Block` utility type ensures that your type is valid. It makes all properties optional, and adds the three properties `component`, `uid`, and `_editable`.

### Content Fields

The fields of Storyblok content/blocks can have many different. Some are trivial, for example text areas (string) - while other are more complex, for example links. Use the types in this package for your convenience:

#### Rich Text


```typescript jsx
import {RichText} from "@johannes-lindgren/storyblok-js";

type Article = Block<{
    richText: RichText,
}>
```

#### Links


```typescript jsx
import {LinkField} from "@johannes-lindgren/storyblok-js";

type Article = Block<{
    link: LinkField,
}>
```

#### Blocks

```typescript jsx
import {Block} from "@johannes-lindgren/storyblok-js";

type Article = Block<{
    blocks: Block[]
}>
```

#### Stories

```typescript jsx
import {StoryOption, StoryOptions} from "@johannes-lindgren/storyblok-js";

type Article = Block<{
    storiesSingleOption: StoryOption
    storiesMultiOptions: StoryOptions
}>
```

#### Options

```typescript jsx
import {SelfOption} from "@johannes-lindgren/storyblok-js";

type Article = Block<{
    selfSingleOption: SelfOption
    languageSingleOption: LanguageOption
    datasourceSingleOption: DatasourceOption
}>
```
