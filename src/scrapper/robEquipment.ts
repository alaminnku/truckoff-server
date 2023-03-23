import puppeteer from "puppeteer";
import Truck from "../models/truck";
import { sendErrorEmail } from "../utils";

export default async function scrapRobEquipment() {
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

      // Get all truck urls from 3 pages
      for (let i = 1; i < 4; i++) {
        try {
          // Go to the page
          await page.goto(`https://rsef.com.au/stock/page/${i}/`, {
            timeout: 0,
          });

          try {
            // Get all urls in the page
            const truckUrlsPerPage = await page.evaluate(() => {
              // Get all url nodes
              const urlNodes = document.querySelectorAll(
                "#isotope-container > div > div > div > div.col-md-8 > div > a"
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
            sendErrorEmail("Rob Equipment");
          }
        } catch (err) {
          // Close the browser and send email
          await browser.close();
          sendErrorEmail("Rob Equipment");
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
                    "#content > div.container.single-car-page > div > div.col-md-4.fantasy-themes-sidebar-width.fantasy-themes-sidebar-car > div > div.widget.autoroyal-car-specifications > table > tbody > tr"
                  )
                )
                  .find(
                    (feature) => feature.firstChild?.textContent === identifier
                  )
                  ?.lastChild?.textContent?.trim();

              // Name
              const name = getSelectorText("div > header > h1");

              // Price
              const price = getSelectorText(
                "#content > div.container.single-car-page > div > div.col-md-4.fantasy-themes-sidebar-width.fantasy-themes-sidebar-car > div > div.widget.autoroyal-price-list > h2 > span"
              );

              // Year
              const year = getSelectorText("div > header > h1 > span");

              // Make
              const make = getFeatureText("Engine Make");

              // Kilometers
              const kilometers = getFeatureText("km Showing")?.replace(
                "km",
                "KM"
              );

              // GVM
              const gvm = getFeatureText("GVM");

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "#cd-item-slider > ol > li"
              );

              // Get all images
              const images = Array.from(imageNodes).map((imageNode) =>
                imageNode.getAttribute("data-bg")
              );

              // Return the truck object
              return {
                name,
                price,
                year,
                make,
                images,
                kilometers,
                location: "SA",
                website: "rsef",
                gvm: gvm ? `${gvm} KG` : undefined,
              };
            });

            // Add truck to trucks
            trucks = [...trucks, truck];
          } catch (err) {
            // Close the browser and send email
            await browser.close();
            sendErrorEmail("Rob Equipment");
          }
        } catch (err) {
          // Close the browser and send email
          await browser.close();
          sendErrorEmail("Rob Equipment");
        }
      }

      // Replace the trucks in the db
      try {
        // Delete all previous trucks
        await Truck.deleteMany({
          website: "rsef",
        });

        try {
          // Create new trucks
          await Truck.create(trucks);

          // Close the browser
          await browser.close();
        } catch (err) {
          // Close the browser and send email
          await browser.close();
          sendErrorEmail("Rob Equipment");
        }
      } catch (err) {
        // Close the browser and send email
        await browser.close();
        sendErrorEmail("Rob Equipment");
      }
    } catch (err) {
      // Close the browser and send email
      await browser.close();
      sendErrorEmail("Rob Equipment");
    }
  } catch (err) {
    sendErrorEmail("Rob Equipment");
  }
}
