import puppeteer from "puppeteer";
import Truck from "../models/truck";
import { sendErrorEmail } from "../utils";

export default async function scrapWestarTruckCentre() {
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
            `https://www.westar.com.au/all-stock/list/page-${i}`,
            { timeout: 0 }
          );

          try {
            // Get all urls in the page
            const truckUrlsPerPage = await page.evaluate(() => {
              // Get all url nodes
              const urlNodes = document.querySelectorAll(
                "#stockListCanvas > div > div > div > div.row.vehicle-data.panel-body > div > div.vehicle-ctas > div:nth-child(1) > div.col-sm-6.view-btn-wrapper > a"
              );

              // Return the full urls
              return Array.from(urlNodes).map(
                (urlNode) => urlNode.getAttribute("href") as string
              );
            });

            // Add urls to truckUrls
            truckUrls = [...truckUrls, ...truckUrlsPerPage];
          } catch (err) {
            // Close the browser and send email
            await browser.close();
            sendErrorEmail("Westar Truck Centre");
          }
        } catch (err) {
          // Close the browser and send email
          await browser.close();
          sendErrorEmail("Westar Truck Centre");
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
              const getFeatureText = (identifier: string) =>
                Array.from(
                  document.querySelectorAll(
                    "#vehicle-details > table > tbody > tr"
                  )
                )
                  .find(
                    (feature) =>
                      feature.firstElementChild?.textContent?.trim() ===
                      identifier
                  )
                  ?.lastElementChild?.textContent?.trim();

              // Name
              const name = getSelectorText(
                "#item_pricing_and_cta_container > div.title_container > div.title_alignment > div > h1"
              );

              // Price
              const price = getSelectorText(
                "#title_pricing_container > div > div.pricing_alignment > div > div.col-xs-6.price > span.price_value"
              )
                ?.slice(1)
                .replace(",", "");

              // Year
              const year = name?.split(" ")[0];

              // Make
              const make = name?.split(" ")[1];

              // Body type
              const bodyType = getFeatureText("Body");

              // GVM
              const gvm = getFeatureText("GVM")?.replace("kg", "KG");

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "#ISV4Canvas > div.detail.inventory.inventory_wrapper.itemtype-truck > div.slider-for > div > img"
              );

              // Get all images
              const images = Array.from(imageNodes).map((imageNode) =>
                imageNode.getAttribute("src")
              );

              // Return the truck object
              return {
                name,
                price,
                year,
                gvm,
                make,
                images,
                bodyType,
                location: "VIC",
                website: "westar",
              };
            });

            // Add truck to trucks
            trucks = [...trucks, truck];
          } catch (err) {
            // Close the browser and send email
            await browser.close();
            sendErrorEmail("Westar Truck Centre");
          }
        } catch (err) {
          // Close the browser and send email
          await browser.close();
          sendErrorEmail("Westar Truck Centre");
        }
      }

      // Replace the trucks in the db
      try {
        // Delete all previous trucks
        await Truck.deleteMany({
          website: "westar",
        });

        try {
          // Create new trucks
          await Truck.create(trucks);

          // Close the browser
          await browser.close();
        } catch (err) {
          // Close the browser and send email
          await browser.close();
          sendErrorEmail("Westar Truck Centre");
        }
      } catch (err) {
        // Close the browser and send email
        await browser.close();
        sendErrorEmail("Westar Truck Centre");
      }
    } catch (err) {
      // Close the browser and send email
      await browser.close();
      sendErrorEmail("Westar Truck Centre");
    }
  } catch (err) {
    sendErrorEmail("Westar Truck Centre");
  }
}
