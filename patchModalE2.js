
const fs = require("fs");
let c = fs.readFileSync("src/components/companies/CompanyFormModal.tsx", "utf8");

// Remove the early return
c = c.replace(/if \(similarConfirm\.show\) \{\n    return \([\s\S]*?\}\n\n  return \(/g, "return (\\n    <>\\n");

// Add the second dialog at the end
c = c.replace(/<\/Dialog>\n  \);\n\}/g, `</Dialog>

      <Dialog open={similarConfirm.show} onClose={() => setSimilarConfirm({show: false, payload: null, similarName: ""})} data-testid="similar-dialog">
        <DialogTitle>\\u062a\\u0623\\u0643\\u064a\\u062f \\u0627\\u0644\\u0625\\u0636\\u0627\\u0641\\u0629</DialogTitle>
        <DialogContent>
          <Typography>\\u0641\\u064a\\u0647 \\u0634\\u0631\\u0643\\u0627\\u062a \\u0645\\u0634\\u0627\\u0628\\u0647\\u0629.. \\u0645\\u062a\\u0623\\u0643\\u062f\\u061f</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSimilarConfirm({show: false, payload: null, similarName: ""})}>\\u0625\\u0644\\u063a\\u0627\\u0621</Button>
          <Button onClick={() => onSubmit(similarConfirm.payload, true)} variant="contained" color="primary" data-testid="similar-confirm">
            \\u0645\\u062a\\u0623\\u0643\\u062f
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}`);

// Add duplicate error data-testid
c = c.replace(/<Alert severity="error" sx={{ mb: 2 }}>/g, "<Alert severity=\"error\" sx={{ mb: 2 }} data-testid=\"duplicate-error\">");

// After success, reset form
c = c.replace(/onSuccess\(\);\n      onClose\(\);/g, "onSuccess();\n      reset();\n      setSimilarConfirm({show: false, payload: null, similarName: \"\"});\n      onClose();");

fs.writeFileSync("src/components/companies/CompanyFormModal.tsx", c);

