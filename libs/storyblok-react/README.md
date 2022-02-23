
<div align="center">
	<h1 align="center">@johannes-lindgren/storyblok-react</h1>
  <p align="center">
    A typed JavaScript library to integrate <a href="https://www.storyblok.com" target="_blank">Storyblok</a> into your React application.
  </p>
  <br />
</div>

## Features

This library allows you to seamlessly integrate Storyblok into your application.

* Easy integration with [Storyblok's visual editor](https://www.storyblok.com/docs/guide/essentials/visual-editor)
* 100% Typescript coverage with `@johannes-lindgren/storyblok-js`
* Easy-to-use content delivery client (based on [storyblok-js-client](https://github.com/storyblok/storyblok-js-client))

In addition...

* All block components becomes clickable in the visual editor immediately after they've been created — even those that have not been saved. (Neither [storyblok-react](https://github.com/storyblok/storyblok-react) or [@storyblok/storyblok-editable](https://github.com/storyblok/storyblok-editable) supports this feature. In these libraries, only those blocks that have the `_editable` property become clickable. Blocks that haven't been saved do not have this property).

## Installation

Install `@johannes-lindgren/storyblok-react` using npm:

```shell
npm install @johannes-lindgren/storyblok-react
```

Using yarn:

```shell
yarn add @johannes-lindgren/storyblok-react 
```

## Getting Started

To create a simple component library with `@johannes-lindgren/storyblok-react`, you only need to invoke the `makeComponents()` function:

```typescript jsx
export const { Story, Block, RichText } = makeStoryblokComponents({
    blockOptions: {
        mapping: {
            // Your components here...
            feature: ({block}) => <h2>{block.headline}</h2>
        }
    },
})
```

`makeComponents()` is a [higher order component](https://reactjs.org/docs/higher-order-components.html) that returns your customized component library. The `blockOptions.mapping` property defines a dictionary that maps your [Storyblok components](https://www.storyblok.com/tp/react-dynamic-component-from-json) to React components.

To render a story, fetch the story with the bundled content delivery client and render with the `<Story>` component:

```typescript jsx
const client = new ContentDeliveryClient(publicToken)
const story = await client.getStory('/dir/subdir/my-story')
return <Story story={story} />
```

That's it!

## Preview Mode

Except for providing a preview token, you do not need to do anything to enable the Storyblok preview in your application — `@johannes-lindgren/storyblok-react` handles the rest!

```typescript jsx
<Story 
    story={story}
    previewToken={myPreviewToken}
    preview
>
```

## Resolve Relations & Links

To [resolve relations](https://www.storyblok.com/tp/using-relationship-resolving-to-include-other-content-entries), simply pass an array to `makeComponents()`:

```typescript jsx
export const { Story, Block, RichText } = makeStoryblokComponents({
    blockOptions: {
        mapping,
    },
    resolve_relations: ['blocComponent.fieldName'],
})
```

Change the strategy for [resolving links](https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/stories/retrieve-one-story) with

```typescript jsx
export const { Story, Block, RichText } = makeStoryblokComponents({
    blockOptions: {
        mapping,
    },
    resolve_links: 'story',
})
```

## Context

The `<Story>` component provides a [context](https://reactjs.org/docs/context.html). By rendering your stories with `<Block>`, the wrapped child components gain access to its context:

```jsx
const story = useStory()
const preview = usePreview() 
```

`usePreview()` is useful for rendering content conditionally. For example, you might want to display errors in preview mode, while completely suppressing them on your public site.


## Typescript