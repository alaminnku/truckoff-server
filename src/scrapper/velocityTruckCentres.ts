import puppeteer from "puppeteer";
import Truck from "../models/truck";
import { sendErrorEmail } from "../utils";

export default async function scrapVelocityTruckCentres() {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1024, height: 1600 },
    });

    try {
      // Create page
      const page = await browser.newPage();

      // Truck URLs
      let truckUrlsAndLocations: { url: string; location: string }[] = [];

      // Get all truck urls from 5 pages
      for (let i = 1; i < 5; i++) {
        try {
          // Go to the page
          await page.goto(
            `https://www.velocitytruckcentres.com.au/inventory/used-trucks?current_page=${i}`,
            { timeout: 0 }
          );

          try {
            // Get all urls in the page
            const truckUrlsAndLocationsPerPage = await page.evaluate(() => {
              // Get all url nodes
              const urlNodes = document.getElementsByClassName(
                "list-bottom listing-view"
              );

              // Get the location nodes
              const locationNodes = document.querySelectorAll(
                "#partialinventory > div > div > div > div.list-body > a"
              );

              // Get locations
              const locations = Array.from(locationNodes).map(
                (locationNode) =>
                  locationNode.getAttribute("href")?.split("location/")[1]
              );

              // Get the full urls
              const urls = Array.from(urlNodes).map(
                (urlNode) =>
                  `https://www.velocitytruckcentres.com.au/inventory/used-trucks/${urlNode.getAttribute(
                    "data-slug"
                  )}`
              );

              const getLocation = (index: number) => locations[index];

              // Return url and location
              return urls.map((url, index) => {
                const location = locations[index];

                return {
                  url,
                  location:
                    location === "dandenong-south"
                      ? "VIC"
                      : location === "regency-park"
                      ? "SA"
                      : location === "perth"
                      ? "WA"
                      : location === "milperra"
                      ? "NSW"
                      : location === "port-melbourne"
                      ? "VIC"
                      : location === "burleigh"
                      ? "QLD"
                      : location === "truganina"
                      ? "VIC"
                      : location === "darra"
                      ? "QLD"
                      : "SA",
                };
              });
            });

            // Add urls to truckUrls
            truckUrlsAndLocations = [
              ...truckUrlsAndLocations,
              ...truckUrlsAndLocationsPerPage,
            ];
          } catch (err) {
            // Send email
            console.log(err);
            // sendErrorEmail("Velocity Truck Centres");
          }
        } catch (err) {
          // Send email
          console.log(err);
          // sendErrorEmail("Velocity Truck Centres");
        }
      }

      // All trucks
      let trucks: any[] = [];

      // Collect truck details
      for (let i = 0; i < truckUrlsAndLocations.length; i++) {
        try {
          // Go to truck page
          await page.goto(truckUrlsAndLocations[i].url, { timeout: 0 });

          try {
            // Create truck details
            const truck = await page.evaluate(() => {
              // Get feature text
              const getFeatureText = (identifier: string) =>
                Array.from(document.querySelectorAll("#descText > li"))
                  .find(
                    (feature) =>
                      feature.firstElementChild?.textContent?.trim() ===
                      identifier
                  )
                  ?.lastElementChild?.textContent?.trim();

              // Name
              const name = document
                .querySelector("#detail-inv-title")
                ?.textContent?.trim();

              // Year
              const year = getFeatureText("Year");

              // Make
              const make = getFeatureText("Make");

              // Model
              const model = getFeatureText("Model");

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "#carousel > div.owl-wrapper-outer > div > div > div > img"
              );

              // Get all images
              const images = Array.from(imageNodes).map((imageNode) =>
                imageNode.getAttribute("data-src")
              );

              // Return the truck object
              return {
                name,
                year,
                make,
                model,
                images,
                price: "poa",
                website: "velocitytruckcentres",
              };
            });

            // Add truck to trucks
            trucks = [
              ...trucks,
              {
                ...truck,
                origin: truckUrlsAndLocations[i].url,
                location: truckUrlsAndLocations[i].location,
              },
            ];
          } catch (err) {
            // Send email
            console.log(err);
            // sendErrorEmail("Velocity Truck Centres");
          }
        } catch (err) {
          // Send email
          console.log(err);
          // sendErrorEmail("Velocity Truck Centres");
        }
      }

      // Replace the trucks in the db
      try {
        // Delete all previous trucks
        await Truck.deleteMany({
          website: "velocitytruckcentres",
        });

        try {
          // Create new trucks
          await Truck.create(trucks);

          // Confirm message
          console.log(trucks.length, "Velocity Truck Centres done");

          // Close the browser
          await browser.close();
        } catch (err) {
          // Close the browser and send email
          console.log(err);
          await browser.close();
          // sendErrorEmail("Velocity Truck Centres");
        }
      } catch (err) {
        // Close the browser and send email
        console.log(err);
        await browser.close();
        // sendErrorEmail("Velocity Truck Centres");
      }
    } catch (err) {
      // Close the browser and send email
      console.log(err);
      await browser.close();
      // sendErrorEmail("Velocity Truck Centres");
    }
  } catch (err) {
    console.log(err);
    // sendErrorEmail("Velocity Truck Centres");
  }
}
