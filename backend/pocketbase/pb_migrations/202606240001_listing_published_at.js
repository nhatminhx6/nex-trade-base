migrate((app) => {
  const listings = app.findCollectionByNameOrId("approved_listings");
  listings.fields.add(new TextField({ name: "published_at" }));
  app.save(listings);
}, (app) => {
  const listings = app.findCollectionByNameOrId("approved_listings");
  listings.fields.removeByName("published_at");
  app.save(listings);
});
