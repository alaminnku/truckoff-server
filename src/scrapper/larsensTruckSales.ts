import puppeteer from "puppeteer";
import { sendErrorEmail } from "../utils";

export default async function scrapLarsensTruckSales() {
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

      // Get all truck urls from 9 pages
      for (let i = 1; i < 3; i++) {
        try {
          // Go to the page
          await page.goto(
            `https://www.larsenstrucksales.com.au/stock?page=${i}`,
            { timeout: 0 }
          );

          try {
            // Get all urls in the page
            const truckUrlsPerPage = await page.evaluate(() => {
              // Get all url nodes
              const urlNodes = document.querySelectorAll(
                "#car-search > div > div.layout > div > section > div > div > div > div.cl-details.d-col-4.equal-btm > a"
              );

              // Return the full urls
              return Array.from(urlNodes).map(
                (urlNode) => urlNode.getAttribute("href") as string
              );
            });

            // Add urls to truckUrls
            truckUrls = [...truckUrls, ...truckUrlsPerPage];
          } catch (err) {
            sendErrorEmail("Larsen's Truck Sales");
          }
        } catch (err) {
          sendErrorEmail("Larsen's Truck Sales");
        }
      }

      // Collect truck details
      for (let i = 0; i < truckUrls.length; i++) {
        try {
          // Go to truck page
          await page.goto(truckUrls[i], { timeout: 0 });

          try {
            // Create truck details
            const truck = await page.evaluate(() => {
              // Find feature
              const getFeatureText = (identifier: string) =>
                Array.from(
                  document.querySelectorAll(
                    "body > main > section > div > div.cl-content > div > div.d-col-8 > ul > li"
                  )
                )
                  .find(
                    (feature) => feature.firstChild?.textContent === identifier
                  )
                  ?.lastChild?.textContent?.trim();

              // Name
              const name = getFeatureText("Vehicle:");

              // Price
              const price = getFeatureText("Price:");

              // Year
              const year = name?.split(" ")[0];

              // Make
              const make = name?.split(" ")[1];

              // Body type
              const bodyType = getFeatureText("Body:");

              // Kilometers
              const kilometers = getFeatureText("Kilometres:")?.replace(
                "kms",
                "KM"
              );

              // GVM
              const gvm = getFeatureText("GVM:");

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "#__next > div.defaultPage > div.bg-white > div.py-md-4.container-xl > div.CarHeading_noMargins__pmNH9.row.no-gutters.overflow-hidden > div.col-lg-7.col-xl-8.order-1.order-lg-1.d-flex > div > div > div.w-100 > div > div > div > img"
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
                make,
                images,
                bodyType,
                kilometers,
                location: "VIC",
                website: "larsenstrucksales",
                gvm: gvm ? `${gvm} KG` : undefined,
              };
            });

            console.log(truck);
          } catch (err) {
            sendErrorEmail("Larsen's Truck Sales");
          }
        } catch (err) {
          sendErrorEmail("Larsen's Truck Sales");
        }
      }
    } catch (err) {
      sendErrorEmail("Larsen's Truck Sales");
    }
  } catch (err) {
    sendErrorEmail("Larsen's Truck Sales");
  }
}
