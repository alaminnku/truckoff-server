import puppeteer from "puppeteer";
import Truck from "../models/truck";
import { sendErrorEmail } from "../utils";

export default async function scrapHumeHighwayTruckSales() {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1024, height: 1600 },
    });

    try {
      // Create page
      const page = await browser.newPage();

      // Truck URLs
      let truckUrls: string[] = [];

      // Get all truck urls from 2 pages
      for (let i = 1; i < 3; i++) {
        try {
          // Go to the page
          await page.goto(
            `https://www.humehighwaytrucksales.com.au/inventory/?/listings/search?ScopeCategoryIDs=27&AccountCRMID=9670801&dlr=1&settingscrmid=9670803&page=${i}`,
            { timeout: 0 }
          );

          try {
            // Get all urls in the page
            const truckUrlsPerPage = await page.evaluate(() => {
              // Get all url nodes
              const urlNodes = document.querySelectorAll(
                "#listContainer > div > div > div > div > div.listing-top > div.listing-top-right > span > span > a"
              );

              // Return the full urls
              return Array.from(urlNodes).map(
                (urlNode) => urlNode.getAttribute("href") as string
              );
            });

            // Add urls to truckUrls
            truckUrls = [...truckUrls, ...truckUrlsPerPage];
          } catch (err) {
            // Send email
            console.log(err);
            // sendErrorEmail("Hume Highway Truck Sales");
          }
        } catch (err) {
          // Send email
          console.log(err);
          // sendErrorEmail("Hume Highway Truck Sales");
        }
      }

      // All trucks
      let trucks: any[] = [];

      // Collect truck details
      for (let i = 0; i < truckUrls.length; i++) {
        try {
          // Go to truck page
          await page.goto(truckUrls[i], { timeout: 0 });

          try {
            // Create truck details
            const truck = await page.evaluate(() => {
              // Get selector text
              const getSelectorText = (selector: string) =>
                document.querySelector(selector)?.textContent?.trim();

              // Get feature text
              const getFeatureText = (identifier: string) => {
                // Get key elements
                const keyElements = Array.from(
                  document.querySelectorAll(
                    "#main-content > div.detail__specs > div:nth-child(2) > div.detail__specs-label"
                  )
                );

                // Get target key element
                const targetElement = keyElements.find(
                  (element) => element.textContent === identifier
                );

                // Get value elements
                const valueElements = Array.from(
                  document.querySelectorAll(
                    "#main-content > div.detail__specs > div:nth-child(2) > div.detail__specs-value"
                  )
                );

                // Return text content of the value element
                if (targetElement) {
                  return valueElements
                    .find(
                      (element, index) =>
                        index === keyElements.indexOf(targetElement)
                    )
                    ?.textContent?.trim();
                }
              };

              // Name
              const name = getSelectorText(
                "#main-content > div.detail__right-col > div.detail__details > div.detail__heading > div.detail__title-container > h1"
              );

              // Price
              const price = getSelectorText(
                "#main-content > div.detail__right-col > div.detail__details > div.listing-prices > div > div.listing-prices__retail > div > span"
              )
                ?.slice(1)
                .replace(",", "");

              // Year
              const year = getFeatureText("Year");

              // Make
              const make = getFeatureText("Manufacturer");

              // Model
              const model = getFeatureText("Model");

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "#mediaControl_0 > div.mc-thumbs.mc-thumbs-overflow > div.mc-thumb-strip > div.mc-thumb-slider > ul > li > div > img"
              );

              // Get all images
              const images = Array.from(imageNodes).map(
                (imageNode) =>
                  `https:${imageNode
                    .getAttribute("data-src")
                    ?.replace("&w=150", "&w=614")
                    .replace("&h=112", "&h=460")}`
              );

              // Return the truck object
              return {
                name,
                price,
                year,
                make,
                model,
                images,
                location: "VIC",
                website: "humehighwaytrucksales",
              };
            });

            // Add truck to trucks
            trucks = [...trucks, { ...truck, origin: truckUrls[i] }];
          } catch (err) {
            // Send email
            console.log(err);
            // sendErrorEmail("Hume Highway Truck Sales");
          }
        } catch (err) {
          // Send email
          console.log(err);
          // sendErrorEmail("Hume Highway Truck Sales");
        }
      }

      // Replace the trucks in the db
      try {
        // Delete all previous trucks
        await Truck.deleteMany({
          website: "humehighwaytrucksales",
        });

        try {
          // Create new trucks
          await Truck.create(trucks);

          // Confirm message
          console.log(trucks.length, "Hume Highway Truck Sales done");

          // Close the browser
          await browser.close();
        } catch (err) {
          // Close the browser and send email
          console.log(err);
          await browser.close();
          // sendErrorEmail("Hume Highway Truck Sales");
        }
      } catch (err) {
        // Close the browser and send email
        console.log(err);
        await browser.close();
        // sendErrorEmail("Hume Highway Truck Sales");
      }
    } catch (err) {
      // Close the browser and send email
      console.log(err);
      await browser.close();
      // sendErrorEmail("Hume Highway Truck Sales");
    }
  } catch (err) {
    console.log(err);
    // sendErrorEmail("Hume Highway Truck Sales");
  }
}
