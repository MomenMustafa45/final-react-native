import { getAreaTags } from "../../services/QuranServices";

export const htmlContent = (imgUri: string, verses: any) => `
 <!DOCTYPE html>
 <html>
 <head>
   <style>
     body, html {
       height: 100%;
       width: 100%;
     }
     .image-container {
       position: relative;
       width: 100%;
       height: 100%;
     }
     img {
       width: 100%;
       height: 100%;
     }
   </style>
   <script src="https://unpkg.com/image-map-resizer@1.0.10/js/imageMapResizer.min.js"></script>
 </head>
 <body>
   <div class="image-container">
     <img src="${imgUri}" usemap="#workmap" />
     <map name="workmap">
       ${getAreaTags(verses)}
     </map>
   </div>
   <script>
     window.onload = function() {
       imageMapResize(); // Initialize image map resizer after the image loads

       // Add click event listeners to each area tag
       document.querySelectorAll('area').forEach(function(area) {
         area.addEventListener('click', function() {
           const verseData = area.getAttribute('data-verse');
           const verseObject = JSON.parse(verseData); // Parse the verse object
           window.ReactNativeWebView.postMessage(JSON.stringify(verseObject)); // Send the full verse object
         });
       });
     };
   </script>
 </body>
 </html>
`;
