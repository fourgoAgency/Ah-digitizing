📌 TODO – Get Quote Form Updates
================================

1️⃣ Required Format Input – Tag-Based Multi-Select + Custom Entry
-----------------------------------------------------------------

*   Convert selected format values into **tag style UI**
    
*   Each selected format should:
    
    *   Show inside span as a **tag**
        
    *   Have an **“X” button** to remove it
        
*   If multiple formats are selected:
    
    *   The span container becomes **writable**
        
*   Allow user to:
    
    *   Type custom format
        
    *   On **space press → auto add as tag**
        
    *   If user types and:
        
        *   Clicks outside
            
        *   Moves to next field→ Auto submit that text as selected format
            
*   Prevent duplicate formats
    

2️⃣ Custom Dropdown Component (Reusable)
----------------------------------------

Create a reusable component with:

### Props:

*   placeholder
    
*   options\[ \]
    

### UI Structure:

*   Left side → **Text Input**
    
*   Right side → **Down Arrow Icon**
    
*   Clicking arrow opens dropdown
    
*   User selects one option
    
*   After selection:
    
    *   Disable typing
        
    *   Selected value shows inside input
        
*   Component returns selected value
    

3️⃣ Live Preview – Additional Notes Overflow Fix
------------------------------------------------

*   Show only **4–5 lines max**
    
*   If text exceeds:
    
    *   Show ......
        
*   Prevent text from overflowing outside box
    
*   Add proper CSS:
    
    *   overflow: hidden
        
    *   text-overflow
        
    *   line-clamp
        

4️⃣ Contact Number Country Code Fix
-----------------------------------

*   If user selects **+1 United States**
    
    *   Do NOT auto-convert to American Samoa
        
*   +1 must remain strictly **United States**
    
*   Remove states from dropdown
    
*   Show only **countries**
    
*   Avoid duplicate country codes
    
*   Ensure correct country-code mapping logic
    

If you want, I can also convert this into a proper GitHub-ready markdown file format with commit message suggestions.

---

# Get Quote Change TODO

- [x] Make `Fabric type` and `Colors name` optional.
- [x] Auto-select `Colorway` to `Default` for embroidery.
- [x] Convert `Number of colors` to custom dropdown with typing support and include `According to Logo`.
- [x] Match live preview field sequence with form sequence (notably after `Design Name` show `Turnaround` next).
- [x] Remove `Quote Preview` text above image in live preview.
- [x] Auto-hide error toast after 7 seconds and add close button.
- [x] Remove `Default` option from `Applique Required` and show placeholder on start.
