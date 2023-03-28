import puppeteer from "puppeteer";
import Truck from "../models/truck";
import { sendErrorEmail } from "../utils";

export default async function scrapMelbourneTruckAndVans() {
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
            `https://www.melbournetruckandvans.com.au/search/used-cars?page=${i}`,
            { timeout: 0 }
          );

          try {
            // Get all urls in the page
            const truckUrlsPerPage = await page.evaluate(() => {
              // Get all url nodes
              const urlNodes = document.querySelectorAll(
                "#__next > div.defaultPage > div.SearchListings_SearchStyle__ELXdt.text-dark > div.container-fluid.pb-5.pt-4 > div.row > div.col-md-9 > div.mb-2 > div > div > div > div > div > a"
              );

              // Return the full urls
              return Array.from(urlNodes).map(
                (urlNode) =>
                  `https://www.melbournetruckandvans.com.au${urlNode.getAttribute(
                    "href"
                  )}`
              );
            });

            // Add urls to truckUrls
            truckUrls = [...truckUrls, ...truckUrlsPerPage];
          } catch (err) {
            // Send email
            console.log(err);
            // sendErrorEmail("Melbourne Truck and Vans");
          }
        } catch (err) {
          // Send email
          console.log(err);
          // sendErrorEmail("Melbourne Truck and Vans");
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

              // Name
              const name = getSelectorText(
                "#__next > div.defaultPage.carPage > div:nth-child(2) > div.py-md-4.container-xl > div.CarHeading_noMargins__pmNH9.row.no-gutters.overflow-hidden > div.col-lg-5.col-xl-4.order-3.order-lg-2.pb-0 > div > div > div:nth-child(1) > h1"
              );

              // Price
              const price = getSelectorText(
                "#__next > div.defaultPage.carPage > div:nth-child(2) > div.py-md-4.container-xl > div.CarHeading_noMargins__pmNH9.row.no-gutters.overflow-hidden > div.col-lg-5.col-xl-4.order-3.order-lg-2.pb-0 > div > div > div:nth-child(1) > div > div.layout__Col-sc-rptak4-1.gEeCsg > span > h3"
              )
                ?.slice(1)
                .replace(",", "");

              // Year
              const year = name?.split(" ")[0];

              // Make
              const make = name?.split(" ")[1];

              // Kilometers
              const kilometers = getSelectorText(
                "#__next > div.defaultPage.carPage > div:nth-child(2) > div.py-md-4.container-xl > div.row.py-4 > div.col-lg-8 > div.row > div.col-md-4 > div > div:nth-child(6)"
              )?.replace("kms", "KM");

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "#__next > div.defaultPage.carPage > div:nth-child(2) > div.py-md-4.container-xl > div.CarHeading_noMargins__pmNH9.row.no-gutters.overflow-hidden > div.col-lg-7.col-xl-8.order-1.order-lg-1.d-flex > div > div > div.w-100 > div > div > div > img"
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
                kilometers,
                location: "VIC",
                website: "melbournetruckandvans",
              };
            });

            // Add truck to trucks
            trucks = [...trucks, { ...truck, origin: truckUrls[i] }];
          } catch (err) {
            // Send email
            console.log(err);
            // sendErrorEmail("Melbourne Truck and Vans");
          }
        } catch (err) {
          // Send email
          console.log(err);
          // sendErrorEmail("Melbourne Truck and Vans");
        }
      }

      // Replace the trucks in the db
      try {
        // Delete all previous trucks
        await Truck.deleteMany({
          website: "melbournetruckandvans",
        });

        try {
          // Create new trucks
          await Truck.create(trucks);

          // Confirm message
          console.log(trucks.length, "Melbourne Truck and Vans done");

          // Close the browser
          await browser.close();
        } catch (err) {
          // Close the browser and send email
          console.log(err);
          await browser.close();
          // sendErrorEmail("Melbourne Truck and Vans");
        }
      } catch (err) {
        // Close the browser and send email
        console.log(err);
        await browser.close();
        // sendErrorEmail("Melbourne Truck and Vans");
      }
    } catch (err) {
      // Close the browser and send email
      console.log(err);
      await browser.close();
      // sendErrorEmail("Melbourne Truck and Vans");
    }
  } catch (err) {
    console.log(err);
    // sendErrorEmail("Melbourne Truck and Vans");
  }
}
