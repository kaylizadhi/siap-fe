"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/survey-table.module.css";

const SurveyTable = ({ params }) => {
  const { id } = params; // Get dynamic route parameter
  const [tableData, setTableData] = useState([]);
  const [selectedRuangLingkup, setSelectedRuangLingkup] = useState("Nasional");

  useEffect(() => {
    if (!id) return; // Ensure `id` is available

    const fetchTableData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}survei/get-survei-detail/${id}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error("Failed to fetch table data:", error);
      }
    };

    fetchTableData();
  }, [id]);

  useEffect(() => {
    let scriptsLoaded = false; // Local variable to track script loading state
    let mapInitialized = false; // Local variable to track map initialization state
  
    const initializeMap = (data) => {
      if (mapInitialized) return; // Prevent multiple map initializations
      mapInitialized = true;
  
      if (typeof anychart === "undefined" || !anychart.map) {
        console.error("AnyChart or map module is not loaded properly.");
        return;
      }
  
      const mapContainer = document.getElementById("map-container");
      if (!mapContainer) {
        console.error("Map container not found.");
        return;
      }
  
      // Clear map container to avoid overlapping maps
      mapContainer.innerHTML = "";
  
      const map = anychart.map();

      const dataSet = anychart.data.set(data);
  
      const series = map.choropleth(dataSet);
      series.geoIdField("id");
      series.colorScale(anychart.scales.linearColor("#D9878D", "#A62626"));
      if (selectedRuangLingkup === "Nasional") {
        series.stroke(null); // Remove borders from the series
        series
          .tooltip()
          .title("Indonesia") // Set the tooltip title as "Indonesia"
          .format("Jumlah Survei: {%value}"); // Customize the tooltip format
      }
      else {
        series
          .tooltip()
          .format("Jumlah Survei: {%value}");
      }
      map.geoData(anychart.maps["indonesia"]);
        map.container("map-container");
        map.draw();
    };
  
    const loadScripts = async () => {
      if (scriptsLoaded) return; // Avoid reloading scripts
      scriptsLoaded = true;
  
      const isScriptLoaded = (src) =>
        !!document.querySelector(`script[src="${src}"]`);
  
      const addScript = (src) =>
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
  
      try {
        await Promise.all([
          !isScriptLoaded("https://cdn.anychart.com/releases/8.13.0/js/anychart-core.min.js")
            ? addScript("https://cdn.anychart.com/releases/8.13.0/js/anychart-core.min.js")
            : Promise.resolve(),
          !isScriptLoaded("https://cdn.anychart.com/releases/8.13.0/js/anychart-map.min.js")
            ? addScript("https://cdn.anychart.com/releases/8.13.0/js/anychart-map.min.js")
            : Promise.resolve(),
          !isScriptLoaded("https://cdn.anychart.com/geodata/2.2.0/countries/indonesia/indonesia.js")
            ? addScript("https://cdn.anychart.com/geodata/2.2.0/countries/indonesia/indonesia.js")
            : Promise.resolve(),
        ]);
  
        console.log("Scripts loaded successfully.");

        const fetchFilteredData = async (ruangLingkup) => {
          const response = await fetch(
            `http://localhost:8000/api/survei/count-by-region/?ruang_lingkup=${ruangLingkup}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data by ruang lingkup");
          }
          return await response.json();
        };
        
        const data = await fetchFilteredData(selectedRuangLingkup);
        anychart.onDocumentReady(() => initializeMap(data));
      } catch (error) {
        console.error("Failed to load AnyChart scripts or data:", error);
      }
    };
  
    loadScripts();
  }, [selectedRuangLingkup]); // Empty dependency array ensures the effect runs only once  

  const handleToggleChange = (event) => {
    setSelectedRuangLingkup(event.target.value);
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Dashboard Progres Survei</h1>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <label style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <input
            type="radio"
            value="Default"
            checked={selectedRuangLingkup === "Default"}
            onChange={handleToggleChange}
          />
          Default
        </label>
        <label style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <input
            type="radio"
            value="Nasional"
            checked={selectedRuangLingkup === "Nasional"}
            onChange={handleToggleChange}
          />
          Nasional
        </label>
        <label style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <input
            type="radio"
            value="Provinsi"
            checked={selectedRuangLingkup === "Provinsi"}
            onChange={handleToggleChange}
          />
          Provinsi
        </label>
        <label style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <input
            type="radio"
            value="Kota"
            checked={selectedRuangLingkup === "Kota"}
            onChange={handleToggleChange}
          />
          Kota
        </label>
      </div>
        <div id="map-container" style={{ height: "350px", marginBottom: "20px" }}></div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Judul Survei</th>
              <th>Tanggal Mulai</th>
              <th>Wilayah</th>
              <th>Jumlah Responden</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>
                  <div className={styles.titleCell}>
                    <img src="/images/user-icon.png" alt="Client" className={styles.icon} />
                    <div>
                      <p>{row.client_name}</p>
                      <span>{row.client_agency}</span>
                    </div>
                  </div>
                </td>
                <td>{row.survey_title}</td>
                <td>{row.start_date}</td>
                <td>{row.region}</td>
                <td>{row.respondent_count}</td>
                <td>
                  <span
                    className={
                      row.status === "Completed"
                        ? styles.statusCompleted
                        : styles.statusOngoing
                    }
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.footer}>
        @2024 optimasys | Contact optimasys.work@gmail.com
      </div>
    </div>
  );
};

export default SurveyTable;
