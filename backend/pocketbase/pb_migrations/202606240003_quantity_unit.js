migrate((app) => {
  ["sourcing_requests", "approved_listings"].forEach((collectionName) => {
    const collection = app.findCollectionByNameOrId(collectionName);
    collection.fields.add(new SelectField({ name: "quantity_unit", values: ["kg", "ton", "container", "carton", "piece"], maxSelect: 1 }));
    app.save(collection);
  });
}, (app) => {
  ["sourcing_requests", "approved_listings"].forEach((collectionName) => {
    const collection = app.findCollectionByNameOrId(collectionName);
    collection.fields.removeByName("quantity_unit");
    app.save(collection);
  });
});
