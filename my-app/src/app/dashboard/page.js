"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/dashboard.module.css";
import StatusChip from "../../components/StatusChip";
import FilterIcon from "../../components/FilterIcon";

const Dashboard = () => {
  const router = useRouter();

  // State management
  const [surveyType, setSurveyType] = useState("keseluruhan");
  const [survei, setSurvei] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterOpenTime, setFilterOpenTime] = useState(null);
  const [selectedRuangLingkup, setSelectedRuangLingkup] = useState("Nasional");
  const [dateFilters, setDateFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [filters, setFilters] = useState({
    nama_klien: "",
    nama_survei: "",
    wilayah_survei: "",
    jumlah_responden: "",
    last_status: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized unique values for filters
  const uniqueValues = useMemo(() => {
    return {
      nama_klien: [...new Set(survei.map((e) => e?.klien).filter(Boolean))],
      nama_survei: [...new Set(survei.map((e) => e?.nama_survei).filter(Boolean))],
      wilayah_survei: [...new Set(survei.map((e) => e?.wilayah_survei).filter(Boolean))],
      jumlah_responden: [...new Set(survei.map((e) => e?.jumlah_responden).filter(Boolean))],
      last_status: [...new Set(survei.map((e) => e?.last_status).filter(Boolean))],
    };
  }, [survei]);

  // Filtered data computation
  const filteredData = useMemo(() => {
    if (!Array.isArray(survei)) return [];

    return survei.filter((item) => {
      if (!item) return false;

      // Date range filtering
      const startDate = dateFilters.startDate ? new Date(dateFilters.startDate) : null;
      const endDate = dateFilters.endDate ? new Date(dateFilters.endDate) : null;
      const itemStartDate = item.waktu_mulai_survei ? new Date(item.waktu_mulai_survei) : null;

      if (startDate && itemStartDate && itemStartDate < startDate) return false;
      if (endDate && itemStartDate && itemStartDate > endDate) return false;

      // Other filters
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        if (key === "nama_klien") {
          return item.klien?.toString() === filters[key]?.toString();
        }
        return item[key]?.toString() === filters[key]?.toString();
      });
    });
  }, [survei, filters, dateFilters]);

  // Map initialization effect
  useEffect(() => {
    let scriptsLoaded = false;
    let mapInitialized = false;

    const initializeMap = (data) => {
      if (mapInitialized) return;
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

      mapContainer.innerHTML = "";
      const map = anychart.map();

      if (selectedRuangLingkup === "Nasional" && data.length === 1 && data[0].id === "ID") {
        // For national view, create data points for all provinces with the same value
        const nationalValue = data[0].value;
        const allProvincesData = [
          { id: "ID.AC", value: nationalValue },
          { id: "ID.KI", value: nationalValue },
          { id: "ID.JR", value: nationalValue },
          { id: "ID.JT", value: nationalValue },
          { id: "ID.BE", value: nationalValue },
          { id: "ID.BT", value: nationalValue },
          { id: "ID.JK", value: nationalValue },
          { id: "ID.KB", value: nationalValue },
          { id: "ID.LA", value: nationalValue },
          { id: "ID.SL", value: nationalValue },
          { id: "ID.BB", value: nationalValue },
          { id: "ID.BA", value: nationalValue },
          { id: "ID.JI", value: nationalValue },
          { id: "ID.KS", value: nationalValue },
          { id: "ID.NT", value: nationalValue },
          { id: "ID.SE", value: nationalValue },
          { id: "ID.SR", value: nationalValue },
          { id: "ID.KR", value: nationalValue },
          { id: "ID.GO", value: nationalValue },
          { id: "ID.JA", value: nationalValue },
          { id: "ID.KT", value: nationalValue },
          { id: "ID.IB", value: nationalValue },
          { id: "ID.SU", value: nationalValue },
          { id: "ID.RI", value: nationalValue },
          { id: "ID.SW", value: nationalValue },
          { id: "ID.133", value: nationalValue },
          { id: "ID.SB", value: nationalValue },
          { id: "ID.YO", value: nationalValue },
          { id: "ID.MA", value: nationalValue },
          { id: "ID.NB", value: nationalValue },
          { id: "ID.SG", value: nationalValue },
          { id: "ID.ST", value: nationalValue },
          { id: "ID.PA", value: nationalValue },
        ];
        const dataSet = anychart.data.set(allProvincesData);
        const series = map.choropleth(dataSet);
        series.geoIdField("id");
        series.colorScale(anychart.scales.linearColor("#D9878D", "#A62626"));
        series.stroke(null);
        series.tooltip().title("Indonesia").format("Jumlah Survei Nasional: {%value}");
      } else {
        // For provincial view, use the data as is
        const dataSet = anychart.data.set(data);
        const series = map.choropleth(dataSet);
        series.geoIdField("id");
        series.colorScale(anychart.scales.linearColor("#D9878D", "#A62626"));
        series.tooltip().format("Jumlah Survei: {%value}");
      }

      map.geoData(anychart.maps["indonesia"]);
      map.container("map-container");
      map.draw();
    };

    const loadScripts = async () => {
      if (scriptsLoaded) return;
      scriptsLoaded = true;

      const isScriptLoaded = (src) => !!document.querySelector(`script[src="${src}"]`);

      const addScript = (src) =>
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

      try {
        setIsLoading(true);
        await Promise.all([!isScriptLoaded("https://cdn.anychart.com/releases/8.13.0/js/anychart-core.min.js") ? addScript("https://cdn.anychart.com/releases/8.13.0/js/anychart-core.min.js") : Promise.resolve(), !isScriptLoaded("https://cdn.anychart.com/releases/8.13.0/js/anychart-map.min.js") ? addScript("https://cdn.anychart.com/releases/8.13.0/js/anychart-map.min.js") : Promise.resolve(), !isScriptLoaded("https://cdn.anychart.com/geodata/2.2.0/countries/indonesia/indonesia.js") ? addScript("https://cdn.anychart.com/geodata/2.2.0/countries/indonesia/indonesia.js") : Promise.resolve()]);

        const fetchFilteredData = async (ruangLingkup) => {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/survei/count-dashboard/?ruang_lingkup=${ruangLingkup}`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch data by ruang lingkup");
          }
          return await response.json();
        };

        const data = await fetchFilteredData(selectedRuangLingkup);
        anychart.onDocumentReady(() => initializeMap(data));
        setError(null);
      } catch (error) {
        console.error("Failed to load AnyChart scripts or data:", error);
        setError("Failed to load map data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadScripts();
  }, [selectedRuangLingkup]);

  // Click outside filter effect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeFilter && !event.target.closest(`.${styles.filterContainer}`)) {
        setActiveFilter(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeFilter]);

  // User verification effect
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/accounts/check_role_dashboard/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await response.json();

        if (data.error || !["Administrasi", "Eksekutif", "Logistik"].includes(data.role)) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to verify role:", error);
        router.push("/login");
      }
    };

    verifyUser();
  }, [router]);

  // Fetch surveys effect
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/survei/${surveyType}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSurvei(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch surveys:", error);
        setError("Failed to fetch survey data. Please try again later.");
        setSurvei([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveys();
  }, [surveyType]);

  // Event handlers
  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const handleSurveyTypeChange = (e) => {
    setSurveyType(e.target.value);
  };

  const handleRuangLingkupChange = (event) => {
    setSelectedRuangLingkup(event.target.value);
  };

  const handleSeeTrackerClick = (id) => {
    router.push(`/tracker-survei/${id}`);
  };

  const handleSeeDetailSurveyClick = (id) => {
    router.push(`/survei/${id}`);
  };

  const formatDateTime = (dateTimeString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateTimeString).toLocaleDateString("id-ID", options);
  };

  const renderColumnFilter = (column, options) => (
    <div className={styles.filterContainer}>
      <button
        className={styles.filterButton}
        onClick={() => {
          if (activeFilter === column) {
            setActiveFilter(null);
            setFilterOpenTime(null);
          } else {
            setActiveFilter(column);
            setFilterOpenTime(Date.now());
          }
        }}
      >
        <FilterIcon />
      </button>
      {activeFilter === column && (
        <div
          className={styles.filterDropdown}
          style={{
            zIndex: filterOpenTime,
          }}
        >
          <label className={styles.filterOption}>
            <input
              type="radio"
              name={column}
              value=""
              checked={!filters[column]}
              onChange={() => {
                handleFilterChange(column, "");
                setActiveFilter(null);
                setFilterOpenTime(null);
              }}
            />
            <span>Semua</span>
          </label>
          {options.map((option, index) => (
            <label key={index} className={styles.filterOption}>
              <input
                type="radio"
                name={column}
                value={option}
                checked={filters[column] === option}
                onChange={(e) => {
                  handleFilterChange(column, e.target.value);
                  setActiveFilter(null);
                  setFilterOpenTime(null);
                }}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.containerBackground}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Dashboard Progres Survei</h1>

          {/* Map Type Selection */}
          <div className={styles.mapTypeSection}>
            <label className={styles.label}>Pilih Tipe Peta</label>
            <div className={styles.radioGroup}>
              {["Nasional", "Provinsi"].map((type) => (
                <React.Fragment key={type}>
                  <input type="radio" id={`map-${type}`} name="mapType" value={type} checked={selectedRuangLingkup === type} onChange={handleRuangLingkupChange} />
                  <label htmlFor={`map-${type}`}>{type}</label>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Map Container */}
          <div className={styles.mapContainer}>
            {isLoading && <div className={styles.loading}>Loading map...</div>}
            {error && <div className={styles.error}>{error}</div>}
            <div id="map-container" style={{ height: "350px", marginBottom: "20px", width: "100%" }}></div>
          </div>

          {/* Survey Type Selection */}
          <div className={styles.surveyTypeSection}>
            <label className={styles.label}>Pilih Jenis Survei</label>
            <div className={styles.radioGroup}>
              {["keseluruhan", "nasional", "provinsi", "kota"].map((type) => (
                <React.Fragment key={type}>
                  <input type="radio" id={type} name="surveyType" value={type} checked={surveyType === type} onChange={handleSurveyTypeChange} />
                  <label htmlFor={type}>Survei {type}</label>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Date Filters */}
          <div className={styles.dateFilterSection}>
            <div className={styles.dateFilterGroup}>
              <div className={styles.dateFilter}>
                <label htmlFor="startDate">Dari Tanggal:</label>
                <input type="date" id="startDate" name="startDate" value={dateFilters.startDate} onChange={handleDateFilterChange} className={styles.dateInput} />
              </div>
              <div className={styles.dateFilter}>
                <label htmlFor="endDate">Sampai Tanggal:</label>
                <input type="date" id="endDate" name="endDate" value={dateFilters.endDate} onChange={handleDateFilterChange} className={styles.dateInput} />
              </div>
            </div>
          </div>

          {/* Survey Table */}
          <div className={styles.tableContainer}>
            {isLoading && <div className={styles.loading}>Loading surveys...</div>}
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.tableScrollContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <div className={styles.columnHeader}>
                        <div className={styles.headerContent}>
                          <span>Nama Klien</span>
                          {renderColumnFilter("nama_klien", uniqueValues.nama_klien)}
                        </div>
                      </div>
                    </th>
                    <th>
                      <div className={styles.columnHeader}>
                        <div className={styles.headerContent}>
                          <span>Judul Survei</span>
                          {renderColumnFilter("nama_survei", uniqueValues.nama_survei)}
                        </div>
                      </div>
                    </th>
                    <th>Tanggal Mulai</th>
                    <th>Tanggal Berakhir</th>
                    <th>
                      <div className={styles.columnHeader}>
                        <div className={styles.headerContent}>
                          <span>Wilayah</span>
                          {renderColumnFilter("wilayah_survei", uniqueValues.wilayah_survei)}
                        </div>
                      </div>
                    </th>
                    <th>
                      <div className={styles.columnHeader}>
                        <div className={styles.headerContent}>
                          <span>Jumlah Responden</span>
                          {renderColumnFilter("jumlah_responden", uniqueValues.jumlah_responden)}
                        </div>
                      </div>
                    </th>
                    <th>
                      <div className={styles.columnHeader}>
                        <div className={styles.headerContent}>
                          <span>Status</span>
                          {renderColumnFilter("last_status", uniqueValues.last_status)}
                        </div>
                      </div>
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <div className={styles.clientCell}>
                          <img src="/images/Profile.svg" alt="User Icon" className={styles.icon} />
                          {e.klien}
                        </div>
                      </td>
                      <td>{e.nama_survei}</td>
                      <td>{e.waktu_mulai_survei && formatDateTime(e.waktu_mulai_survei)}</td>
                      <td>{e.waktu_berakhir_survei && formatDateTime(e.waktu_berakhir_survei)}</td>
                      <td>{e.wilayah_survei}</td>
                      <td>{e.jumlah_responden}</td>
                      <td>
                        <StatusChip text={e.last_status} />
                      </td>
                      <td className={styles.actions}>
                        <div className={styles.actionButtonGroup}>
                          <button className={`${styles.actionButton} ${styles.detailButton}`} onClick={() => handleSeeDetailSurveyClick(e.id)}>
                            Lihat Detail
                          </button>
                          <button className={`${styles.actionButton} ${styles.trackerButton}`} onClick={() => handleSeeTrackerClick(e.id)}>
                            Lihat Tracker
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
