interface SheetSelectorProps {
  sheets: readonly string[]
  selectedSheet: string
  onSheetChange: (sheet: string) => void
}

const SheetSelector: React.FC<SheetSelectorProps> = ({ sheets, selectedSheet, onSheetChange }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600', 
        color: '#333' 
      }}>
        Filtrar por Planilha:
      </label>
      <select
        value={selectedSheet}
        onChange={(e) => onSheetChange(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          backgroundColor: 'white',
          fontSize: '14px',
          minWidth: '200px',
          cursor: 'pointer'
        }}
      >
        <option value="all">Todas as Planilhas</option>
        {sheets.filter(sheet => sheet !== 'Planilha1').map((sheet) => (
          <option key={sheet} value={sheet}>
            {sheet}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SheetSelector