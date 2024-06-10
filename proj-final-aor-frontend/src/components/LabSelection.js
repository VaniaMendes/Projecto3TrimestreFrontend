import React from 'react';

function LabSelection({ selectedLab, handleChangeLab }) {
  return (
    <div className="radio-buttonsConfirm">
      <div className="radio-item">
        <input type="radio" id="option1" name="lab" value="LISBOA" checked={selectedLab === "LISBOA"} onChange={handleChangeLab} />
        <label className="radio-description" htmlFor="option1">Lisboa</label>
      </div>
      
      <div className="radio-item">
        <input type="radio" id="option2" name="lab" value="COIMBRA" checked={selectedLab === "COIMBRA"} onChange={handleChangeLab} />
        <label className="radio-description" htmlFor="option2">Coimbra</label>
      </div>
      
      <div className="radio-item">
        <input type="radio" id="option3" name="lab" value="PORTO" checked={selectedLab === "PORTO"} onChange={handleChangeLab} />
        <label className="radio-description" htmlFor="option3">Porto</label>
      </div>
      
      <div className="radio-item">
        <input type="radio" id="option4" name="lab" value="TOMAR" checked={selectedLab === "TOMAR"} onChange={handleChangeLab} />
        <label className="radio-description" htmlFor="option4">Tomar</label>
      </div>
      
      <div className="radio-item">
        <input type="radio" id="option5" name="lab" value="VISEU" checked={selectedLab === "VISEU"} onChange={handleChangeLab} />
        <label className="radio-description" htmlFor="option5">Viseu</label>
      </div>
      
      <div className="radio-item">
        <input type="radio" id="option6" name="lab" value="VILA_REAL" checked={selectedLab === "VILA_REAL"} onChange={handleChangeLab} />
        <label className="radio-description" htmlFor="option6">Vila-Real</label>
      </div>
    </div>
  );
}

export default LabSelection;
