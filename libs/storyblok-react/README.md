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

More [details below](#typescript).

### Content Components

Create your React components for rendering content with `createBlockComponent()`:

```typescript jsx
import {makeBlockComponent} from "@johannes-lindgren/storyblok-react";

export const Feature = makeBlockComponent<FeatureData>(({block}) => (
    <div className="feature">
        <h2>{block.headline}</h2>
    </div>
), 'feature')
```

This will ensure that your app is nicely integrated with the Storyblok visual editor. The type of the `block` attribute is of the same type of the generic argument to `makeBlockComponent()`, with a few changes:

* The `_uid` and `component` properties are automatically added.
* All properties of the type argument are made optional. (Even if you define your your component fields to be mandatory, they can still be missing during the preview.)

Use the component as such:

```typescript jsx
<Feature block={story.content as Feature}/>
```

### Render Dynamically

By creating your block components with `makeBlockComponent()`, you unlock the dynamic Storyblok components:

```typescript jsx
export const { DynamicBlock } = makeStoryblokComponents({
    blockComponents: [Feature], // Register your block components here
})
```

Now you can render your content dynamically with:

```typescript jsx
<DynamicBlock block={story.content}/>
```
If no corresponding component has been registered in `makeStoryblokComponents()`, a Fallback component will be displayed.

### Preview Mode

`makeStoryblokComponents()` also returns the `<DynamicStory/>` component:

```typescript jsx
export const { DynamicStory } = makeStoryblokComponents({
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

If the end-user adds blocks to the rich text, these will be rendered within the rich text, presuming that corresponding block components have been registered within `makeStoryblokComponents()`.

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

### Custom Fallback Components

You can substitute the built-in default fallback components to your own.

Create a component as such:

```typescript jsx
export const MyBlockFallback = makeBlockComponent(({block}) => (
    <Alert severity='error'>Unknown component type `{block.component}`</Alert>
))
```

We can omit the second argument, as this React component does not correspond to a specific Storyblok component.

Use the fallback in your dynamic components as such:

```typescript jsx
export const {DynamicStory, DynamicBlock, RichText} = makeStoryblokComponents({
    blockComponents: [],
    BlockFallback: MyBlockFallback
})
```

Similarly, you can create your own fallbacks for Rich Text nodes. 

### Story Components

`makeStoryComponent()` works similar to `makeBlockComponent()`, but it also enables live-updates when the end-user is in preview.

Any components that are rendered within a story components can access the story from the [context](https://reactjs.org/docs/context.html) with react hooks:

```jsx
const story = useStory()
```

If you want to render story properties other than `content` - for example the `name`, then create your own custom story component with `makeStoryComponent()`:

```typescript jsx
export const DynamicStory = makeStoryComponent(({story, children}) => (
    <article>
      <h1>{story.name}</h1>
      <DynamicBlock block={story.content}/>
    </article>
))
```

Now you can use this component instead of the one from `makeStoryblokComponents()`.

## TypeScript

See `@johannes-lindgren/storyblok-js` for the various Storyblok types.

## Examples & Use Cases

Some common use cases are outlined in these subsections.

### Nested Blocks

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
