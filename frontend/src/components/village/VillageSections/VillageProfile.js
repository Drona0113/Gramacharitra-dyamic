import React from 'react';

const VillageProfile = ({ data }) => {
  const profile = data || {};

  return (
    <section className="demographics">
      <div className="container">
        <div className="section-title">
          <h2>Village Profile</h2>
        </div>
        
        <table className="stats-table">
          <tbody>
            <tr>
              <td>Population</td>
              <td>{profile.population || '—'}</td>
            </tr>
            <tr>
              <td>Languages</td>
              <td>{profile.languages || '—'}</td>
            </tr>
            <tr>
              <td>Literacy</td>
              <td>{profile.literacy || '—'}</td>
            </tr>
            <tr>
              <td>Occupation</td>
              <td>{profile.occupation || '—'}</td>
            </tr>
            <tr>
              <td>Nearest Town</td>
              <td>{profile.nearestTown || '—'}</td>
            </tr>
            <tr>
              <td>Transport</td>
              <td>{profile.transport || '—'}</td>
            </tr>
            <tr>
              <td>PIN Code</td>
              <td>{profile.pinCode || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default VillageProfile;