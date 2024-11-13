# storyblok-content

Proof of concepts for Storyblok libraries:

- Strict type safety with Storyblok
- Content parsing
- Components as code
- Generating parsers from components
- Inferring types from components
- Migrations

## Examples

In this repository, you will find a few examples:

### Manual Types

Directory: `examples/manual-types`

In this example, you manually define type aliases and components in Storyblok UI that matche each other.

Finally, with the help of [PureParse](https://www.npmjs.com/package/pure-parse), you can easily construct parsers for your content in a type-safe manner.

#### Questions

- Should it handle field-level translations? In case we don not want the Delivery API to do so for us.
- Should it resolve references? In case we do not want this to be handled by a separate tool.

### Configuration as Code

Directory: `examples/configuration-as-code`

In this example, you define your components in code which you:

- push to Storyblok
- generate parsers from
- infer types from

Magic!

### Migrations

Directory: `examples/migrations`

Over time, your component library might evolve. By defining components in code, you can easily retain the entire version history. The challenge is to migrate the content, once the components have been updated.

The migration example demonstrates how you can migrate content from one version to another by making use of the parsers from the previous examples.

#### Questions:

This example is more work-in-progress than the others. This one has not been proven to work yet. Considering the way Storyblok models content, it might prove to be unfeasible to get right.

- When you perform the migration, the user needs to be dealing with a data format that allows the migration library to write the data back in a loss-free manner. For example, when you migrate a number field, you cannot be dealing with a number—it may be more convenient to do so when rendering the content, but conversions between binary and decimal formats are lossy.
