import React from 'react';
import { Check, X, Star, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PG {
  id: string;
  name: string;
  monthlyRent: number;
  overallRating: number;
  distance: number;
  foodSafetyRating?: number;
  amenities: string[];
}

interface ComparisonProps {
  pgs: PG[];
  onClose: () => void;
  onBook: (pg: PG) => void;
}

const PropertyComparison: React.FC<ComparisonProps> = ({ pgs, onClose, onBook }) => {
  const commonAmenities = Array.from(new Set(pgs.flatMap(pg => pg.amenities)));

  return (
    <motion.div 
      className="comparison-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="comparison-container glass"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="comparison-header">
          <h2>Compare PGs</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                {pgs.map(pg => (
                  <th key={pg.id}>
                    <div className="pg-name-cell">
                      <strong>{pg.name}</strong>
                      <span className="rent-badge">₹{pg.monthlyRent}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Rating</strong></td>
                {pgs.map(pg => (
                  <td key={pg.id}>
                    <span className="rating-pill">
                      <Star size={14} fill="#fbbf24" color="#fbbf24" /> {pg.overallRating}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Distance</strong></td>
                {pgs.map(pg => (
                  <td key={pg.id}>
                    <span className="distance-pill">
                      <MapPin size={14} /> {pg.distance} km
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Food Safety</strong></td>
                {pgs.map(pg => (
                  <td key={pg.id}>
                    {pg.foodSafetyRating ? (
                      <span className="safety-pill">Verified {pg.foodSafetyRating}/5</span>
                    ) : (
                      <span className="muted">N/A</span>
                    )}
                  </td>
                ))}
              </tr>
              {commonAmenities.map(amenity => (
                <tr key={amenity}>
                  <td>{amenity}</td>
                  {pgs.map(pg => (
                    <td key={pg.id}>
                      {pg.amenities.includes(amenity) ? (
                        <Check size={18} color="#10b981" />
                      ) : (
                        <X size={18} color="#ef4444" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="action-row">
                <td></td>
                {pgs.map(pg => (
                  <td key={pg.id}>
                    <button className="btn btn-primary btn-sm w-full" onClick={() => onBook(pg)}>
                      Book Now
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <style>{`
        .comparison-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1100;
          display: grid;
          place-items: center;
          padding: 2rem;
        }
        .comparison-container {
          width: 100%;
          max-width: 1000px;
          background: white;
          border-radius: 24px;
          padding: 2.5rem;
          max-height: 90vh;
          overflow-y: auto;
        }
        .comparison-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .comparison-table-wrapper {
          overflow-x: auto;
        }
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
        }
        .comparison-table th, .comparison-table td {
          padding: 1.25rem 1rem;
          text-align: center;
          border-bottom: 1px solid var(--border);
        }
        .comparison-table th:first-child, .comparison-table td:first-child {
          text-align: left;
          width: 200px;
          font-weight: 600;
          color: var(--text-muted);
        }
        .pg-name-cell {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }
        .rent-badge {
          background: #eef2ff;
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
          font-size: 0.85rem;
        }
        .rating-pill, .distance-pill, .safety-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          background: #f8fafc;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .action-row td {
          border-bottom: none;
          padding-top: 2rem;
        }
      `}</style>
    </motion.div>
  );
};

export default PropertyComparison;
