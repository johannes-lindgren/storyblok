<div align="center">
	<h1 align="center">@johannes-lindgren/storyblok-react</h1>
  <p align="center">
    A typed JavaScript library to integrate <a href="https://www.storyblok.com" target="_blank">Storyblok</a> into your React application.
  </p>
  <br />
</div>

## About

This library allows you to seamlessly integrate Storyblok into your application.

* Easy integration with [Storyblok's visual editor](https://www.storyblok.com/docs/guide/essentials/visual-editor)
* 100% Typescript coverage
* Easy-to-use content delivery client (based on [storyblok-js-client](https://github.com/storyblok/storyblok-js-client))
* Includes types from `@johannes-lindgren/storyblok-js`
* Advanced `<RichText/>` component to render content inline.
* Components for rendering dynamic content

In addition...

* All block components becomes clickable in the visual editor immediately after they've been created — even those that
  have not been saved. (Neither [storyblok-react](https://github.com/storyblok/storyblok-react)
  or [@storyblok/storyblok-editable](https://github.com/storyblok/storyblok-editable) supports this feature. In these
  libraries, only those blocks that have the `_editable` property become clickable. Blocks that haven't been saved do
  not have this property).

## Getting Started

Follow these guide to integrate the core features of this library into your project.

### Installation

Install `@johannes-lindgren/storyblok-react` using npm:

```shell
npm install @johannes-lindgren/storyblok-react
```

Alternatively, using yarn:

```shell
yarn add @johannes-lindgren/storyblok-react 
```

### Fetch Content

Fetch content with the `ContentDeliveryClient`:

```typescript jsx
const client = new ContentDeliveryClient(publicToken)
const story = await client.getStory('/dir/subdir/my-feature')
```

### Content Types

If you use TypeScript, define your content types as such:

```typescript jsx
export type FeatureData = {
    type: 'info' | 'error'
    body: string
}
```

More [information in the section below](#typescript).

### Content Components

Create your React components for rendering content with `createBlockComponent()`:

```typescript jsx
import {makeBlockComponent} from "@johannes-lindgren/storyblok-react";

export const Feature = makeBlockComponent<FeatureData>('feature', ({block}) => (
    <div className="feature">
        <h2>{block.headline}</h2>
    </div>
))
```

Use the component as such

```typescript jsx
<Feature block={story.content as Feature}/>
```

### Render Dynamically

By creating your block components with `makeBlockComponent()`, you can access the `<DynamicBlock/>` API:

```typescript jsx
export const { DynamicBlock } = makeStoryblokComponents({
    blockComponents: [Feature], // Register your block components here
})
```

Now you can render your content dynamically as such:

```typescript jsx
<DynamicBlock block={story.content}/>
```
If no corresponding component has been registered in `makeStoryblokComponents()`, a Fallback component will be displayed.

### Preview Mode

`makeStoryblokComponents()` also returns the `<DynamicStory/>` component:

```typescript jsx
export const {DynamicStory} = makeStoryblokComponents({
    blockComponents: [Feature],
})
```

Now you can render the story as such:

```typescript jsx
<DynamicStory story={story}/>
```

This has the advantage that it allows you to enable the live-preview with Storyblok's visual editor. Enable preview by wrapping the component within a `<PreviewProvider>`:

```typescript jsx
<PreviewProvider
    previewToken={previewToken}
    enabled
>
    <DynamicStory story={story}/>
</PreviewProvider>
```

That is all you need to enable all features of the visual editor!

### Rich Text

`makeStoryblokComponents()` also returns the `<RichText/>` component:

```typescript jsx
export const {RichText} = makeStoryblokComponents({
    blockComponents: [Feature],
})
```

Now you can render your rich text as such:

```typescript jsx
import {RichText as RichTextData} from "@johannes-lindgren/storyblok-js";
import {RichText} from "@resume-builder/components/storyblok-components";

export type SectionData = {
    title: string
    text: RichTextData
}

export const Section = makeBlockComponent<SectionData>(
    ({block}) => {
        return (
            <>
                <Typography variant='h2'>{block.title}</Typography>
                <RichText richText={block.text}/>
            </>
        )
    }
)
```

If the rich text contain embedded blocks, these will be rendered within the rich text, presuming that corresponding block components have been registered within `makeStoryblokComponents()`.

### Layouts

If you want to define your layouts with stories, you will typically need to pass a child prop to the story component.

```typescript jsx
export type LayoutData = {
    header: HeaderBlock[]
    footer: FooterBlock[]
}

export const LayoutStory = makeStoryComponent<LayoutData, { children?: ReactNode }>(({story, children}) => (
    <Layout block={story.content}>
        {children}
    </Layout>
))

export const Layout = makeBlockComponent<LayoutData, { children?: ReactNode }>(({block, children}) => (
    <>
        <DynamicBlock block={block?.header?.[0]}/>
        <Toolbar/>
        <Main>
            {children}
        </Main>
        <DynamicBlock block={block?.footer?.[0]}/>
    </>
))
```

Use the story component instead of the Layout block, or the preview will not work!

## Details

The sections below provide additional detail to the features mentioned in the getting started section.

### Resolve Relations & Links

To [resolve relations](https://www.storyblok.com/tp/using-relationship-resolving-to-include-other-content-entries),
simply pass an array to the `ContentDeliveryClient.getStory()`:

```typescript jsx
const resolve_links = 'story'
const resolve_relations = ['page.otherStory']
client.getStory(slugs, {
    version: previewToken ? 'draft' : 'published',
    resolve_links,
    resolve_relations,
    language,
})
```

To resolve relations in preview mode, you also need to supply the values to the `<PreviewProvider/> as such:

```typescript jsx
const resolve_links = 'story'
const resolve_relations = ['page.otherStory']
return (
    <PreviewProvider
        previewToken={previewToken}
        enabled={!!previewToken}
        resolveRelations={['page.feature']}
        resolveLinks={'story'}
    >
        <LayoutStory story={layoutStory}>
            <DynamicStory story={story}/>
        </LayoutStory>
    </PreviewProvider>
)
```

Any component can access the preview context with React hooks:

```typescript jsx
const preview = usePreview() 
```

This can be useful to display different information depending on the end-user. For example, components that renders with error can be hidden in non-preview mode, but indicate the error with bright colors in preview mode. This is what the default fallback component does.

### Story Components

`makeStoryComponent()` works similar to `makeBlockComponent()`, but it also enables live-updates when the end-user is in preview.

Any components that are rendered within a story components can access the story from the [context](https://reactjs.org/docs/context.html) with react hooks:

```jsx
const story = useStory()
```

## TypeScript

See `@johannes-lindgren/storyblok-js` for the various Storyblok types.

## Examples

### Nested Blocs

If you need to render a block within a dynamic block, use `<DynamicBlock/>` (from `makeStoryblokComponents()`):

```typescript jsx
export type GridData = {
    items: Block[]
}

export const Grid = makeBlockComponent<GridData>(({block}) => (
    <>
        {block.items?.map(item => (
            <DynamicBlock block={item} key={item._uid}/>
        ))}
    </>
))
```