# AML Developers Documentation

-   [Structure](#structure)
-   [RdfModel](#rdfmodel)
-   [CacheStrategy](#cachestrategy)
-   [Aspect Model Loader](#aspect-model-loader)
-   [Namespace Loader](#namespace-loader)
-   [useLoader](#useloader)

## Structure

-   `aspect-meta-model`- Contains all definitions of SAMM elements
-   `instantiator` - Contains all instantiator functions described [here](#instantiator-functions)
-   `shared`
    -   `rdf-loader.ts`
    -   [`rdf-model.ts`](#rdfmodel)
    -   `units.ts`
    -   `xsd-datatypes.ts`
    -   `elements-set.ts`
    -   [`meta-model-cache.service.ts`](#cachestrategy)
    -   `props.ts`
-   `vocabulary`- Contains all definitions from simple SAMM elements to SAMM libraries regarding characteristics, entities and units.

## RdfModel

This class is instantiated every time a model is loaded. Here is found all data about a model:

-   `store` - N3 Store containing the model quads
-   `metaModelVersion` - current version of SAMM
-   `aspectModelUrn` - the aspect urn if there is any
-   `prefixes` - the prefixes of the model
-   all SAMM definitions (samm, sammC, sammE, sammU)

## CacheStrategy

Am instance of this class is created at the moment an instantiator functionality is called.

This class stores and manage the instantiated SAMM elements read from one or multiple models.

## Aspect Model Loader

Located in `aspect-model-loader.ts`, this functionality will load a model with or without an Aspect. If the model has dependencies is recommended to pass the aspect urn as parameter.

There are two ways to use the aspect model loader.

1. Using the class form

    ```typescript
    const loader = new AspectModelLoader();
    loader.load(aspectUrn, [model1Content, model2Content, ...]).subscribe((result) => {
      // the result will be
      {
        aspect // DefaultAspect
        initProps: {
          rdfModel // RdfModel
          cache // CacheStrategy
        }
      }
    });
    ```

2. Using the function

    ```typescript
    loadAspectModel({
      filesContent: [model1Content, model2Content, ...];
      aspectModelUrn?: aspectUrn
    }).subscribe(result => {
        // the result will be
        {
          aspect // DefaultASpect
          store // N3 Store
          rdfModel // RdfModel
          cache // CacheStrategy
        }
    });
    ```

## Namespace Loader

Located in `namespace-loader.ts`, this functionality is used to create a map of every namespace found in the provided contents with their elements (DefaultAspect, DefaultProperty, etc...).

This loader can be used as follows

```typescript
const namespaceLoader: Map<string, NamedElement[]> = new NamespaceLoader();
namespaceLoader.load([content1, content2, ..., contentN]).subscribe((result) => {
  // the result will be of type Map
  {
    namespace1: [DefaultElement11, DefaultElement12, ...],
    namespace1: [DefaultElement21, DefaultElement22, ...],
    ....
    namespaceN: [DefaultElementN1, DefaultElementN2, ...]
  }
})
```

## useLoader

`useLoader` is used to create an isolated space for one `rdfModel` and one optional `cache`. This function will return an object containing a multitude of functions, each function with a single scope: creating one ESMF element (DefaultAspect, DefaultProperty, etc...) with the information inside `rdfModel`.

```typescript
// rdfModel and cache are optional
const objWithManyFunctions = useLoader({rdfModel: RdfModel, cache: CacheStrategy});
```

> _WRITER NOTICE <br> For the next devs: create a standard for what those functions receives as parameters_

### Instantiator functions

<table width="100%">
  <thead>
    <th>Function</th>
    <th>Parameter(s)</th>
    <th>Description</th>
  </thead>
  <tbody>
    <tr> 
      <td>createAspect</td>
      <td>aspectUrn: string</td>
      <td>Creates a DefaultAspect instance from the RDF model</td>
    </tr>
    <tr> 
      <td>createEntity</td>
      <td>quads: Quad[], isAbstract = false, extending?: ComplexType</td>
      <td>Creates a DefaultEntity instance from the RDF model starting from the `quads`. If `isAbstract` is set to true, then the function will create a DefaultEntity representing an Abstract Entity (having isAbstract set to true)</td>
    </tr>
    <tr> 
      <td>createEvent</td>
      <td>quad</td>
      <td>Creates a DefaultEvent instance from the RDF model starting from given quad</td>
    </tr>
    <tr> 
      <td>createEvents</td>
      <td>subject: Quad_Subject</td>
      <td>Creates multiple DefaultEvent instances from the RDF model starting from subject which is the Aspect which contains the list of events</td>
    </tr>
    <tr> 
      <td>createOperation</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultOperation instance from the RDF model. The quad parameter can be the line where the operation is the object or the subject</td>
    </tr>
    <tr> 
      <td>createProperty</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultProperty instance from the RDF model. The quad needs to have the property as an object </td>
    </tr>
    <tr> 
      <td>createProperties</td>
      <td>subject: Quad_Subject</td>
      <td>Creates multiple DefaultProperty instances from the RDF model. The subject can be either an Aspect, an Entity or an element containing a list of properties</td>
    </tr>
    <tr> 
      <td>createUnit</td>
      <td>urn: string</td>
      <td>Creates a DefaultUnit instance from the RDF model or creates a default unit</td>
    </tr>
    <tr> 
      <td>createQuantityKind</td>
      <td>name: string</td>
      <td>Creates a DefaultQuantityKind instance from a predefined list of quantity kinds.</td>
    </tr>
    <tr> 
      <td>createTimeSeriesEntity</td>
      <td>-</td>
      <td>Creates a predefined TimeSeries entity.</td>
    </tr>
    <tr> 
      <td>create3dPointEntity</td>
      <td>-</td>
      <td>Creates a predefined 3D Point entity.</td>
    </tr>
    <tr> 
      <td>createFileResourceEntity</td>
      <td>-</td>
      <td>Creates a predefined FileResource entity.</td>
    </tr>
    <tr> 
      <td>createPredefinedEntity</td>
      <td>name: string</td>
      <td>Creates one of the above predefined entities based on the given name</td>
    </tr>
    <tr> 
      <td>getSupportedEntityNames</td>
      <td>-</td>
      <td>Returns a list of supported predefined entity names</td>
    </tr>
    <tr> 
      <td>createEncodingConstraint</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultEncodingConstraint from the RDF model</td>
    </tr>
    <tr> 
      <td>createFixedPointConstraint</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultFixedPointConstraint from the RDF model</td>
    </tr>
    <tr> 
      <td>createLanguageConstraint</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultLanguageConstraint from the RDF model</td>
    </tr>
    <tr> 
      <td>createLengthConstraint</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultLengthConstraint from the RDF model</td>
    </tr>
    <tr> 
      <td>createLocaleConstraint</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultLocaleConstraint from the RDF model</td>
    </tr>
    <tr> 
      <td>createRangeConstraint</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultRangeConstraint from the RDF model</td>
    </tr>
    <tr> 
      <td>createRegularExpressionConstraint</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultRegularExpressionConstraint from the RDF model</td>
    </tr>
    <tr> 
      <td>createConstraint</td>
      <td>quad: Quad</td>
      <td>Creates any constraint type based on its RDF definition</td>
    </tr>
    <tr> 
      <td>createDefaultCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultCharacteristic instance from the RDF model</td>
    </tr>
    <tr> 
      <td>createCodeCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultCode characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createCollectionCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultCollection characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createDurationCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultDuration characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createEitherCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultEither characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createEnumerationCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultEnumeration characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createListCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultList characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createMeasurementCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultMeasurement characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createQuantifiableCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultQuantifiable characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createSetCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultSet characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createSingleEntityCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultSingleEntity characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createSortedSetCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultSortedSet characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createTimeSeriesCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultTimeSeries characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createTraitCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates a DefaultTrait characteristic from the RDF model</td>
    </tr>
    <tr> 
      <td>createCharacteristic</td>
      <td>quad: Quad</td>
      <td>Creates any characteristic type based on its RDF definition</td>
    </tr>
    <tr> 
      <td>resolveEntityInstance</td>
      <td>quad: quad</td>
      <td>Resolves and creates an entity instance from the RDF model</td>
    </tr>
  </tbody>
</table>

### Getter functions

<table width="100%">
  <thead>
    <th>Function</th>
    <th>Parameter(s)</th>
    <th>Description</th>
  </thead>

  <tbody>
    <tr> 
      <td>getAllPredefinedEntities</td>
      <td>-</td>
      <td>Returns all available predefined entity instances. Every value is a new instance to comply with AME</td>
    </tr>
    <tr> 
      <td>getSupportedCharacteristicNames</td>
      <td>-</td>
      <td>Returns a list of supported characteristic type names</td>
    </tr>
  </tbody>
</table>
