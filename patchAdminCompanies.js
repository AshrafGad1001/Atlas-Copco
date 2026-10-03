
const fs = require("fs");
let c = fs.readFileSync("src/app/(admin)/admin/companies/page.tsx", "utf8");
c = c.replace(/const \[importing, setImporting\] = useState\(false\);/g, "const [importing, setImporting] = useState(false);\n  const [importPreview, setImportPreview] = useState<any>(null);");

c = c.replace(/const handleImport = async \(\) => \{[\s\S]*?setImporting\(false\);\n    \}\n  \};/g, `const handleImport = async (isDryRun = false) => {
    if (!importFile) return;
    setImporting(true);
    const formData = new FormData();
    formData.append("file", importFile);
    if (isDryRun) formData.append("dryRun", "true");
    try {
      const res = await fetchApi("/admin/companies/import", {
        method: "POST",
        body: formData
      });
      if (isDryRun) {
        setImportPreview(res.data);
      } else {
        alert(\`\\u062a\\u0645 \\u0625\\u0636\\u0627\\u0641\\u0629 \${res.data.added} \\u0648\\u062a\\u062c\\u0627\\u0647\\u0644 \${res.data.ignored}\`);
        setImportModalOpen(false);
        setImportFile(null);
        setImportPreview(null);
        loadCompanies();
      }
    } catch (e: any) {
      alert(e.message || "\\u062e\\u0637\\u0623");
    } finally {
      setImporting(false);
    }
  };`);

c = c.replace(/<Dialog open=\{importModalOpen\} onClose=\{\(\) => setImportModalOpen\(false\)\}>[\s\S]*?<\/Dialog>/g, `<Dialog open={importModalOpen} onClose={() => { setImportModalOpen(false); setImportPreview(null); setImportFile(null); }}>
        <DialogTitle>\\u0627\\u0633\\u062a\\u064a\\u0631\\u0627\\u062f \\u0634\\u0631\\u0643\\u0627\\u062a</DialogTitle>
        <DialogContent dividers>
          <input type="file" accept=".xlsx" onChange={(e) => { setImportFile(e.target.files?.[0] || null); setImportPreview(null); }} />
          {importing && <Typography>\\u062c\\u0627\\u0631\\u064a \\u0627\\u0644\\u0627\\u0633\\u062a\\u064a\\u0631\\u0627\\u062f...</Typography>}
          {importPreview && (
            <div data-testid="import-preview">
              <Typography>\\u0633\\u064a\\u062a\\u0645 \\u0625\\u0636\\u0627\\u0641\\u0629 {importPreview.added} \\u0634\\u0631\\u0643\\u0629</Typography>
              <Typography>\\u0633\\u064a\\u062a\\u0645 \\u062a\\u062c\\u0627\\u0647\\u0644 {importPreview.ignored} \\u0634\\u0631\\u0643\\u0629</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setImportModalOpen(false); setImportPreview(null); setImportFile(null); }}>\\u0625\\u0644\\u063a\\u0627\\u0621</Button>
          {!importPreview ? (
            <Button onClick={() => handleImport(true)} variant="contained" disabled={!importFile || importing}>
              \\u0645\\u0639\\u0627\\u064a\\u0646\\u0629
            </Button>
          ) : (
            <Button onClick={() => handleImport(false)} variant="contained" color="primary" disabled={!importFile || importing}>
              \\u062a\\u0623\\u0643\\u064a\\u062f
            </Button>
          )}
        </DialogActions>
      </Dialog>`);
fs.writeFileSync("src/app/(admin)/admin/companies/page.tsx", c);

