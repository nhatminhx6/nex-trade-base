migrate((app) => {
  const listings = app.findCollectionByNameOrId("approved_listings");
  listings.listRule = "@request.auth.role = 'admin' || request.status = 'approved'";
  listings.viewRule = "@request.auth.role = 'admin' || request.status = 'approved'";
  app.save(listings);
}, (app) => {
  const listings = app.findCollectionByNameOrId("approved_listings");
  listings.listRule = "";
  listings.viewRule = "";
  app.save(listings);
});
