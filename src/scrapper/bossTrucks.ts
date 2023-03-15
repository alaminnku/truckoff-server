import puppeteer from "puppeteer";

export default async function scrapBossTrucks() {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      headless: false,
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
            `https://www.bosstrucksales.com.au/all-stock/list/page-${i}`,
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
            throw err;
          }
        } catch (err) {
          throw err;
        }
      }

      // Collect truck details
      for (let i = 0; i < truckUrls.length; i++) {
        try {
          // Go to truck page
          await page.goto(truckUrls[i], { timeout: 0 });

          // Click on image button
          const button = await page.$(
            "#image-gallery > div > div.gallery-ribbon-holder > div > div"
          );

          await button?.click();

          try {
            // Create truck details
            const truck = await page.evaluate(() => {
              // Get selector text
              const getSelectorText = (selector: string) =>
                document.querySelector(selector)?.textContent?.trim();

              // Name
              const name = getSelectorText(
                "#item_pricing_and_cta_container > div.title_container.hidden-xs.hidden-sm > div.title_alignment > div > h2"
              );

              // Price
              const price = getSelectorText(
                "#title_pricing_container > div > div.pricing_alignment > div > div.col-xs-6.price > span"
              );

              // Year
              const year = name?.split(" ")[0];

              // Make
              const make = name?.split(" ")[1];

              // Body type
              const bodyType = getSelectorText(
                "#vehicle-details > table > tbody > tr:nth-child(3) > td:nth-child(2)"
              );

              // GVM
              const gvm = getSelectorText(
                "#vehicle-details > table > tbody > tr:nth-child(10) > td:nth-child(2)"
              )?.replace("kg", "KG");

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "#all_thumbs > div > div > a > img"
              );

              // Get all images
              const images = Array.from(imageNodes).map((imageNode) =>
                imageNode.getAttribute("src")?.replace(".2", "")
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
                location: "QLD",
              };
            });

            console.log(truck);
          } catch (err) {
            throw err;
          }
        } catch (err) {
          throw err;
        }
      }
      // Close the browser
      await browser.close();
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
}