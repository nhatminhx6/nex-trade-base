migrate((app) => {
  ["sourcing_requests", "approved_listings"].forEach((collectionName) => {
    const collection = app.findCollectionByNameOrId(collectionName);
    collection.fields.add(new TextField({ name: "product_description" }));
    app.save(collection);
  });
}, (app) => {
  ["sourcing_requests", "approved_listings"].forEach((collectionName) => {
    const collection = app.findCollectionByNameOrId(collectionName);
    collection.fields.removeByName("product_description");
    app.save(collection);
  });
});
