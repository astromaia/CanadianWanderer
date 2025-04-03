import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set the title of the document
document.title = "Canadian Explorer - Travel Itinerary Generator";

createRoot(document.getElementById("root")!).render(<App />);
