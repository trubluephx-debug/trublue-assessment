import { useState, useRef, useCallback } from "react";

const BLUE = "#1B4F8A";
const GREEN = "#5BAD72";
const ORANGE = "#E87722";
const RED = "#C0392B";
const LIGHT = "#F4F6F9";

const sectionConfig = [
  {
    id: "resident", label: "Resident Information", icon: "👤", hasPhotos: false,
    fields: [
      { id: "name", label: "Full Name", type: "text", required: true },
      { id: "address", label: "Address", type: "text", required: true },
      { id: "phone", label: "Contact Number", type: "text" },
      { id: "referredBy", label: "Referred By", type: "select", options: ["HelperBees","AHCCCS","VA","Local Partner","Self-Referral","Other"] },
      { id: "housingType", label: "Housing Type", type: "select", options: ["House","Apartment","Condo","Mobile Home","Other"] },
      { id: "floors", label: "Number of Floors", type: "select", options: ["1","2","3+"] },
      { id: "livesWith", label: "Lives With", type: "select", options: ["Alone","Spouse/Partner","Family Member","Caregiver","Other"] },
      { id: "assistiveDevices", label: "Assistive Devices Used", type: "multicheck", options: ["Walker","Cane","Wheelchair","Rollator","None"] },
      { id: "concerns", label: "Health/Safety Concerns", type: "multicheck", options: ["History of Falls","Visual Impairment","Cognitive Concerns","Limited Mobility","Has Caregiver","Chronic Pain","Hearing Loss"] },
      { id: "fallHistory", label: "Recent Fall History (past 12 months)", type: "textarea", placeholder: "Location, cause, and result of any falls..." },
      { id: "clientGoals", label: "Client's Independent Living Goals", type: "textarea", placeholder: "What does the resident want to do safely at home?" },
    ]
  },
  {
    id: "exterior", label: "Exterior & Entryways", icon: "🏠", hasPhotos: true,
    photoLabel: "Entryway / Exterior Photos",
    fields: [
      { id: "drivewayLighting", label: "Adequate lighting at driveway, walkways & entry doors?", type: "yesno" },
      { id: "pathsAfterDark", label: "Outdoor paths usable and visible after dark?", type: "yesno" },
      { id: "walkwayCondition", label: "Driveways/walkways smooth, level, free of cracks?", type: "yesno" },
      { id: "stepsVisible", label: "Steps clearly visible and in good condition?", type: "yesno" },
      { id: "handrailsPresent", label: "Steps/ramps have sturdy handrails?", type: "yesno" },
      { id: "rampPresent", label: "If ramp present: non-slip, wide, gently sloped?", type: "yesno_na" },
      { id: "entryClutter", label: "Entryway free of clutter, loose rugs, and cords?", type: "yesno" },
      { id: "thresholdHeight", label: "Thresholds low (under 1 inch)?", type: "yesno" },
      { id: "exteriorBarriers", label: "Barriers Identified", type: "textarea", placeholder: "Describe specific barriers or hazards observed..." },
      { id: "exteriorGoals", label: "Client Goals for This Area", type: "textarea", placeholder: "e.g. Access mailbox, greet visitors, enter/exit safely..." },
    ]
  },
  {
    id: "interior", label: "Interior Pathways & Flooring", icon: "🚪", hasPhotos: true,
    photoLabel: "Interior / Hallway Photos",
    fields: [
      { id: "hallwayLighting", label: "Hallways clear, well-lit, free of tripping hazards?", type: "yesno" },
      { id: "hallwayWidth", label: "Hallways wide enough for walker or wheelchair?", type: "yesno" },
      { id: "floorsNonSlip", label: "Floors non-slip and in good condition throughout?", type: "yesno" },
      { id: "throwRugs", label: "Throw rugs removed or secured with non-skid backing?", type: "yesno" },
      { id: "cordsCleared", label: "Cords and wires kept out of walk paths?", type: "yesno" },
      { id: "furnitureStable", label: "Furniture stable and allows clear movement?", type: "yesno" },
      { id: "interiorBarriers", label: "Barriers Identified", type: "textarea", placeholder: "Describe specific hazards or mobility obstacles..." },
    ]
  },
  {
    id: "stairs", label: "Stair Safety", icon: "🪜", hasPhotos: true,
    photoLabel: "Stairway Photos",
    fields: [
      { id: "stairsPresent", label: "Are there stairs in the home?", type: "yesno" },
      { id: "stairHandrails", label: "Handrails on both sides?", type: "yesno" },
      { id: "stairTreads", label: "Stair treads secure, non-slip, clearly visible?", type: "yesno" },
      { id: "stairLighting", label: "Well-lit with switches at top and bottom?", type: "yesno" },
      { id: "stairClutter", label: "Stairs free of clutter and obstacles?", type: "yesno" },
      { id: "stairBarriers", label: "Barriers Identified", type: "textarea", placeholder: "Describe stair-related hazards or concerns..." },
    ]
  },
  {
    id: "bathroom", label: "Bathroom Safety", icon: "🚿", hasPhotos: true,
    photoLabel: "Bathroom Photos",
    fields: [
      { id: "grabBars", label: "Grab bars properly installed near toilet and shower/tub?", type: "yesno" },
      { id: "bathroomFloor", label: "Bathroom flooring non-slip when wet?", type: "yesno" },
      { id: "bathroomLighting", label: "Adequate lighting including a night-light?", type: "yesno" },
      { id: "toiletHeight", label: "Toilet height appropriate or raised?", type: "yesno" },
      { id: "waterTemp", label: "Water temperature controlled (≤120°F)?", type: "yesno" },
      { id: "bathingAids", label: "Bathing aids used if needed (shower chair, handheld)?", type: "yesno_na" },
      { id: "bathroomBarriers", label: "Barriers Identified", type: "textarea", placeholder: "Transfer issues, reach problems, fall risks..." },
      { id: "bathroomGoals", label: "Client Goals for This Room", type: "textarea", placeholder: "e.g. Shower independently, use toilet safely..." },
    ]
  },
  {
    id: "kitchen", label: "Kitchen Safety", icon: "🍳", hasPhotos: true,
    photoLabel: "Kitchen Photos",
    fields: [
      { id: "itemsInReach", label: "Frequently used items within easy reach (waist–shoulder)?", type: "yesno" },
      { id: "stoveControls", label: "Stove controls easy to see and operate?", type: "yesno" },
      { id: "kitchenLighting", label: "Good lighting over work areas?", type: "yesno" },
      { id: "fireHazards", label: "Fire hazards kept away from stove?", type: "yesno" },
      { id: "fireExtinguisher", label: "Working fire extinguisher present?", type: "yesno" },
      { id: "kitchenBarriers", label: "Barriers Identified", type: "textarea", placeholder: "Reaching hazards, appliance access, fall risks..." },
      { id: "kitchenGoals", label: "Client Goals for This Room", type: "textarea", placeholder: "e.g. Safely cook meals, access appliances..." },
    ]
  },
  {
    id: "bedroom", label: "Bedroom Safety", icon: "🛏️", hasPhotos: true,
    photoLabel: "Bedroom Photos",
    fields: [
      { id: "pathToBathroom", label: "Clear path from bed to bathroom?", type: "yesno" },
      { id: "bedsideLighting", label: "Lighting accessible from the bed?", type: "yesno" },
      { id: "bedroomClutter", label: "Rugs, cords, clutter removed from walking areas?", type: "yesno" },
      { id: "bedTransferSupport", label: "Support available for getting in/out of bed?", type: "yesno" },
      { id: "phoneNearBed", label: "Phone or alert device within reach of the bed?", type: "yesno" },
      { id: "bedroomBarriers", label: "Barriers Identified", type: "textarea", placeholder: "Transfer issues, night navigation, clutter..." },
      { id: "bedroomGoals", label: "Client Goals for This Room", type: "textarea", placeholder: "e.g. Transfer independently, reach bathroom safely at night..." },
    ]
  },
  {
    id: "emergency", label: "Emergency & Fire Safety", icon: "🚨", hasPhotos: false,
    fields: [
      { id: "smokeDetectors", label: "Smoke detectors on every level?", type: "yesno" },
      { id: "coDetector", label: "Carbon monoxide detector present?", type: "yesno" },
      { id: "emergencyNumbers", label: "Emergency numbers clearly posted?", type: "yesno" },
      { id: "canCallForHelp", label: "Resident can easily call for help?", type: "yesno" },
      { id: "exitPlan", label: "Clear emergency exit plan in place?", type: "yesno" },
      { id: "medsLabeled", label: "Medications clearly labeled and stored safely?", type: "yesno" },
      { id: "emergencyNotes", label: "Notes", type: "textarea" },
    ]
  },
];

function priorityColor(p) {
  if (!p) return BLUE;
  const u = p.toUpperCase();
  if (u.includes("HIGH") || u.includes("IMMEDIATE")) return RED;
  if (u.includes("MOD") || u.includes("NEAR")) return ORANGE;
  return GREEN;
}
function priorityBg(p) {
  if (!p) return "#e8eef7";
  const u = p.toUpperCase();
  if (u.includes("HIGH") || u.includes("IMMEDIATE")) return "#fdf0ef";
  if (u.includes("MOD") || u.includes("NEAR")) return "#fff4ec";
  return "#edf7f0";
}

function PhotoUploader({ sectionId, photos, onPhotosChange, label }) {
  const inputRef = useRef();
  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onPhotosChange(sectionId, [...(photos || []), { id: Date.now() + Math.random(), dataUrl: e.target.result, name: file.name, caption: "" }]);
      };
      reader.readAsDataURL(file);
    });
  };
  const updateCaption = (photoId, caption) => onPhotosChange(sectionId, (photos || []).map(p => p.id === photoId ? { ...p, caption } : p));
  const removePhoto = (photoId) => onPhotosChange(sectionId, (photos || []).filter(p => p.id !== photoId));
  const onDrop = useCallback((e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }, [photos]);

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontWeight: 700, color: BLUE, fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>📷 {label || "Assessment Photos"}</div>
      {(photos || []).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          {(photos || []).map(photo => (
            <div key={photo.id} style={{ width: 155, borderRadius: 8, border: "1.5px solid #ddd", overflow: "hidden", background: "#fff" }}>
              <div style={{ position: "relative" }}>
                <img src={photo.dataUrl} alt="" style={{ width: "100%", height: 106, objectFit: "cover", display: "block" }} />
                <button onClick={() => removePhoto(photo.id)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.55)", border: "none", color: "#fff", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: 10, lineHeight: "20px", textAlign: "center" }}>✕</button>
              </div>
              <input placeholder="Caption..." value={photo.caption} onChange={e => updateCaption(photo.id, e.target.value)}
                style={{ width: "100%", border: "none", borderTop: "1px solid #eee", padding: "5px 7px", fontSize: 11, color: "#555", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
          ))}
        </div>
      )}
      <div onDrop={onDrop} onDragOver={e => e.preventDefault()} onClick={() => inputRef.current?.click()}
        style={{ border: "2px dashed #c5d5e8", borderRadius: 10, padding: "16px", textAlign: "center", cursor: "pointer", background: "#f8fbff", color: "#7a9cc0" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = BLUE}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#c5d5e8"}>
        <div style={{ fontSize: 20, marginBottom: 3 }}>📸</div>
        <div style={{ fontSize: 12, fontWeight: 600 }}>Click or drag photos here</div>
        <div style={{ fontSize: 11, opacity: 0.75 }}>JPG, PNG — multiple allowed</div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
    </div>
  );
}

function YesNoField({ id, label, value, onChange, allowNA }) {
  const options = allowNA ? ["Yes", "No", "N/A"] : ["Yes", "No"];
  return (
    <div style={{ marginBottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid #f2f2f2" }}>
      <label style={{ fontSize: 13, color: "#444", flex: 1, lineHeight: 1.4 }}>{label}</label>
      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(id, opt)}
            style={{
              padding: "4px 13px", borderRadius: 20, border: "1.5px solid",
              borderColor: value === opt ? (opt === "Yes" ? GREEN : opt === "No" ? ORANGE : "#999") : "#e0e0e0",
              background: value === opt ? (opt === "Yes" ? "#edf7f0" : opt === "No" ? "#fff3ec" : "#f5f5f5") : "#fff",
              color: value === opt ? (opt === "Yes" ? GREEN : opt === "No" ? ORANGE : "#666") : "#bbb",
              fontWeight: value === opt ? 700 : 400, cursor: "pointer", fontSize: 12
            }}>{opt}</button>
        ))}
      </div>
    </div>
  );
}

function MultiCheckField({ id, label, options, value = [], onChange }) {
  const toggle = (opt) => { const next = (value||[]).includes(opt) ? value.filter(v=>v!==opt) : [...(value||[]),opt]; onChange(id,next); };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontWeight: 600, color: "#333", marginBottom: 7, fontSize: 13 }}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => toggle(opt)}
            style={{ padding: "5px 12px", borderRadius: 20, border: "1.5px solid", borderColor: (value||[]).includes(opt) ? BLUE : "#e0e0e0", background: (value||[]).includes(opt) ? "#e8eef7" : "#fff", color: (value||[]).includes(opt) ? BLUE : "#aaa", fontWeight: (value||[]).includes(opt) ? 700 : 400, cursor: "pointer", fontSize: 12 }}>{opt}</button>
        ))}
      </div>
    </div>
  );
}

function SectionForm({ section, data, onChange, photos, onPhotosChange }) {
  return (
    <div>
      {section.fields.map(f => {
        const val = data[f.id];
        if (f.type === "yesno") return <YesNoField key={f.id} id={f.id} label={f.label} value={val} onChange={onChange} />;
        if (f.type === "yesno_na") return <YesNoField key={f.id} id={f.id} label={f.label} value={val} onChange={onChange} allowNA />;
        if (f.type === "multicheck") return <MultiCheckField key={f.id} id={f.id} label={f.label} options={f.options} value={val} onChange={onChange} />;
        if (f.type === "select") return (
          <div key={f.id} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontWeight: 600, color: "#333", marginBottom: 6, fontSize: 13 }}>{f.label}{f.required && <span style={{ color: ORANGE }}> *</span>}</label>
            <select value={val||""} onChange={e=>onChange(f.id,e.target.value)} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:13,color:"#333",background:"#fff" }}>
              <option value="">Select...</option>
              {f.options.map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        );
        if (f.type === "textarea") return (
          <div key={f.id} style={{ marginBottom: 14, marginTop: 10 }}>
            <label style={{ display:"block",fontWeight:600,color:"#333",marginBottom:6,fontSize:13 }}>{f.label}</label>
            <textarea value={val||""} onChange={e=>onChange(f.id,e.target.value)} placeholder={f.placeholder||""} rows={3}
              style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:13,resize:"vertical",fontFamily:"inherit",boxSizing:"border-box",color:"#333" }} />
          </div>
        );
        return (
          <div key={f.id} style={{ marginBottom: 14 }}>
            <label style={{ display:"block",fontWeight:600,color:"#333",marginBottom:6,fontSize:13 }}>{f.label}{f.required&&<span style={{color:ORANGE}}> *</span>}</label>
            <input type="text" value={val||""} onChange={e=>onChange(f.id,e.target.value)} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:13,boxSizing:"border-box",color:"#333" }} />
          </div>
        );
      })}
      {section.hasPhotos && <PhotoUploader sectionId={section.id} photos={photos} onPhotosChange={onPhotosChange} label={section.photoLabel} />}
    </div>
  );
}

function buildPrompt(formData, sectionPhotos) {
  const g = (sec, field) => { const v=(formData[sec]||{})[field]; if(Array.isArray(v)) return v.join(", ")||"Not specified"; return v||"Not specified"; };
  const photoSummary = Object.entries(sectionPhotos).filter(([,p])=>p&&p.length>0).map(([sec,photos])=>`${sec}: ${photos.length} photo(s), captions: ${photos.map(p=>p.caption||"no caption").join("; ")}`).join("\n")||"None";

  return `You are a Certified Aging-in-Place Specialist generating a concise Home Safety Report in JSON format.

ASSESSMENT:
Name: ${g("resident","name")} | Address: ${g("resident","address")} | Referred: ${g("resident","referredBy")}
Housing: ${g("resident","housingType")}, ${g("resident","floors")} floor(s) | Lives With: ${g("resident","livesWith")}
Devices: ${g("resident","assistiveDevices")} | Concerns: ${g("resident","concerns")}
Falls: ${g("resident","fallHistory")} | Goals: ${g("resident","clientGoals")}

EXTERIOR: Lighting=${g("exterior","drivewayLighting")} Paths=${g("exterior","pathsAfterDark")} Walkways=${g("exterior","walkwayCondition")} Steps=${g("exterior","stepsVisible")} Handrails=${g("exterior","handrailsPresent")} Ramp=${g("exterior","rampPresent")} Entry=${g("exterior","entryClutter")} Thresholds=${g("exterior","thresholdHeight")}
Barriers: ${g("exterior","exteriorBarriers")} | Goals: ${g("exterior","exteriorGoals")}

INTERIOR: Hallways=${g("interior","hallwayLighting")} Width=${g("interior","hallwayWidth")} Floors=${g("interior","floorsNonSlip")} Rugs=${g("interior","throwRugs")} Cords=${g("interior","cordsCleared")} Furniture=${g("interior","furnitureStable")}
Barriers: ${g("interior","interiorBarriers")}

STAIRS: Present=${g("stairs","stairsPresent")} Handrails=${g("stairs","stairHandrails")} Treads=${g("stairs","stairTreads")} Lighting=${g("stairs","stairLighting")} Clear=${g("stairs","stairClutter")}
Barriers: ${g("stairs","stairBarriers")}

BATHROOM: Grab bars=${g("bathroom","grabBars")} Floor=${g("bathroom","bathroomFloor")} Lighting=${g("bathroom","bathroomLighting")} Toilet=${g("bathroom","toiletHeight")} Water=${g("bathroom","waterTemp")} Aids=${g("bathroom","bathingAids")}
Barriers: ${g("bathroom","bathroomBarriers")} | Goals: ${g("bathroom","bathroomGoals")}

KITCHEN: Reach=${g("kitchen","itemsInReach")} Stove=${g("kitchen","stoveControls")} Lighting=${g("kitchen","kitchenLighting")} Fire=${g("kitchen","fireHazards")} Extinguisher=${g("kitchen","fireExtinguisher")}
Barriers: ${g("kitchen","kitchenBarriers")} | Goals: ${g("kitchen","kitchenGoals")}

BEDROOM: Path=${g("bedroom","pathToBathroom")} Lighting=${g("bedroom","bedsideLighting")} Clutter=${g("bedroom","bedroomClutter")} Transfer=${g("bedroom","bedTransferSupport")} Phone=${g("bedroom","phoneNearBed")}
Barriers: ${g("bedroom","bedroomBarriers")} | Goals: ${g("bedroom","bedroomGoals")}

EMERGENCY: Smoke=${g("emergency","smokeDetectors")} CO=${g("emergency","coDetector")} Numbers=${g("emergency","emergencyNumbers")} CanCall=${g("emergency","canCallForHelp")} Exit=${g("emergency","exitPlan")} Meds=${g("emergency","medsLabeled")}
Notes: ${g("emergency","emergencyNotes")}

PHOTOS: ${photoSummary}

Return ONLY valid JSON — no markdown, no code fences, no explanation:

{
  "clientSummary": {
    "housingType": "string",
    "floors": "string",
    "livesWith": "string",
    "assistiveDevices": "string",
    "referralReason": "1-2 sentence summary of client situation and goals",
    "overallRisk": "HIGH or MODERATE or LOW",
    "overallRiskNote": "one brief sentence"
  },
  "priorityRisks": [
    { "priority": "HIGH or MODERATE or LOW", "area": "area name", "issue": "brief issue", "recommendation": "brief fix" }
  ],
  "rooms": [
    {
      "id": "exterior or interior or stairs or bathroom or kitchen or bedroom or emergency",
      "name": "Display name",
      "accessibilityScore": 0-100,
      "safetyScore": 0-100,
      "goals": ["goal 1"],
      "barriers": ["barrier 1"],
      "recommendations": [
        { "title": "short title", "description": "one sentence", "priority": "HIGH or MODERATE or LOW" }
      ],
      "photoCaption": "brief note on what photos show, or No photos provided"
    }
  ],
  "actionPlan": {
    "immediate": ["action"],
    "nearTerm": ["action"],
    "longTerm": ["action"]
  },
  "closingSummary": "2-3 sentence encouraging, supportive closing"
}

Rules: only include rooms with actual findings. Skip rooms with all-Yes and no barriers. Max 5 priority risks. Max 4 items per action plan tier. Keep everything concise.`;
}

function GaugeArc({ pct, color }) {
  const r=28, cx=40, cy=38, angle=(pct/100)*180, rad=(angle-180)*Math.PI/180;
  const x=cx+r*Math.cos(rad), y=cy+r*Math.sin(rad), large=angle>180?1:0;
  const bg=`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`;
  const fg=pct>0?`M ${cx-r} ${cy} A ${r} ${r} 0 ${large} 1 ${x} ${y}`:"";
  return (
    <svg width={72} height={44} viewBox="0 0 80 50">
      <path d={bg} fill="none" stroke="#eee" strokeWidth="8" strokeLinecap="round"/>
      {fg&&<path d={fg} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>}
      <text x={cx} y={cy+1} textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>{pct}%</text>
    </svg>
  );
}

function RoomCard({ room, photos }) {
  const rPhotos = photos || [];
  const icons = { exterior:"🏠", interior:"🚪", stairs:"🪜", bathroom:"🚿", kitchen:"🍳", bedroom:"🛏️", emergency:"🚨" };
  const aColor = room.accessibilityScore>=70?GREEN:room.accessibilityScore>=40?ORANGE:RED;
  const sColor = room.safetyScore>=70?GREEN:room.safetyScore>=40?ORANGE:RED;

  return (
    <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e8eaed", overflow:"hidden", marginBottom:18 }}>
      {/* Room header bar */}
      <div style={{ background:"#f7f8fc", borderBottom:"1px solid #eaecf0", padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <span style={{ fontSize:18 }}>{icons[room.id]||"🏠"}</span>
          <span style={{ fontWeight:800, fontSize:14, color:"#1a1a2e" }}>{room.name}</span>
        </div>
        <div style={{ display:"flex", gap:18 }}>
          <div style={{ textAlign:"center" }}>
            <GaugeArc pct={room.accessibilityScore} color={aColor}/>
            <div style={{ fontSize:10, color:"#999" }}>Accessibility</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <GaugeArc pct={room.safetyScore} color={sColor}/>
            <div style={{ fontSize:10, color:"#999" }}>Safety</div>
          </div>
        </div>
      </div>

      {/* Body: findings + photos side by side */}
      <div style={{ padding:"16px 18px", display:"flex", gap:18 }}>
        <div style={{ flex:1, minWidth:0 }}>
          {room.goals && room.goals.length>0 && (
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:10, fontWeight:800, color:BLUE, textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Client Goals</div>
              {room.goals.map((g,i)=>(
                <div key={i} style={{ display:"flex", gap:6, marginBottom:4, fontSize:13, color:"#444", alignItems:"flex-start" }}>
                  <span style={{ color:BLUE, flexShrink:0, marginTop:1 }}>›</span>{g}
                </div>
              ))}
            </div>
          )}
          {room.barriers && room.barriers.length>0 && (
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:10, fontWeight:800, color:RED, textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Barriers Identified</div>
              {room.barriers.map((b,i)=>(
                <div key={i} style={{ display:"flex", gap:6, marginBottom:4, fontSize:13, color:"#444", alignItems:"flex-start" }}>
                  <span style={{ color:RED, flexShrink:0, marginTop:1 }}>•</span>{b}
                </div>
              ))}
            </div>
          )}
          {room.recommendations && room.recommendations.length>0 && (
            <div>
              <div style={{ fontSize:10, fontWeight:800, color:GREEN, textTransform:"uppercase", letterSpacing:0.5, marginBottom:7 }}>Recommendations</div>
              {room.recommendations.map((r,i)=>(
                <div key={i} style={{ marginBottom:7, padding:"8px 11px", borderRadius:7, background:priorityBg(r.priority), borderLeft:`3px solid ${priorityColor(r.priority)}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:2 }}>
                    <span style={{ fontSize:10, fontWeight:800, color:priorityColor(r.priority), textTransform:"uppercase" }}>{r.priority}</span>
                    <span style={{ fontWeight:700, fontSize:13, color:"#222" }}>{r.title}</span>
                  </div>
                  <div style={{ fontSize:12, color:"#555" }}>{r.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Photo column */}
        <div style={{ width:210, flexShrink:0 }}>
          <div style={{ fontSize:10, fontWeight:800, color:"#999", textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>📷 Photos</div>
          {rPhotos.length>0 ? (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {rPhotos.map((photo,i)=>(
                <div key={i} style={{ borderRadius:8, overflow:"hidden", border:"1px solid #e0e0e0" }}>
                  <img src={photo.dataUrl} alt={photo.caption||"Assessment photo"} style={{ width:"100%", height:126, objectFit:"cover", display:"block" }}/>
                  {photo.caption && <div style={{ padding:"5px 8px", fontSize:11, color:"#555", background:"#f8f9fc", lineHeight:1.35 }}>{photo.caption}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ border:"2px dashed #dde3ee", borderRadius:8, padding:"22px 14px", textAlign:"center", background:"#f9fbff" }}>
              <div style={{ fontSize:22, marginBottom:6 }}>📷</div>
              <div style={{ fontSize:11, color:"#bbb", lineHeight:1.4 }}>
                {room.photoCaption && room.photoCaption!=="No photos provided" ? room.photoCaption : "No photos attached"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportView({ reportData: d, formData, sectionPhotos, onBack, onRegenerate }) {
  const resident = formData.resident || {};
  const riskColor = d.clientSummary?.overallRisk==="HIGH"?RED:d.clientSummary?.overallRisk==="MODERATE"?ORANGE:GREEN;

  return (
    <div style={{ minHeight:"100vh", background:LIGHT, fontFamily:"Inter, Arial, sans-serif" }}>
      <div style={{ background:BLUE, padding:"13px 26px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ background:"#fff", borderRadius:6, padding:"3px 9px", fontWeight:900, color:BLUE, fontSize:13 }}>TruBlue</div>
          <span style={{ color:"#fff", fontWeight:700, fontSize:14 }}>Home Safety Report</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onRegenerate} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", color:"#fff", borderRadius:7, padding:"6px 14px", cursor:"pointer", fontSize:12 }}>↺ Regenerate</button>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", color:"#fff", borderRadius:7, padding:"6px 14px", cursor:"pointer", fontSize:12 }}>← Back</button>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 18px" }}>

        {/* Header card */}
        <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", boxShadow:"0 2px 14px rgba(0,0,0,0.07)", marginBottom:18 }}>
          <div style={{ background:`linear-gradient(135deg, ${BLUE} 0%, #2563b0 100%)`, padding:"24px 28px", color:"#fff" }}>
            <div style={{ fontSize:20, fontWeight:900, letterSpacing:-0.3 }}>HOME SAFETY ASSESSMENT</div>
            <div style={{ fontSize:12, opacity:0.8, marginTop:3 }}>{new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</div>
          </div>
          <div style={{ padding:"18px 28px", display:"flex", flexWrap:"wrap", gap:20, alignItems:"flex-start" }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontSize:17, fontWeight:800, color:"#1a1a2e" }}>{resident.name||"—"}</div>
              <div style={{ fontSize:13, color:"#666", marginTop:2 }}>{resident.address||"—"}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:10 }}>
                {[["Housing",d.clientSummary?.housingType],["Floors",d.clientSummary?.floors],["Lives With",d.clientSummary?.livesWith],["Devices",d.clientSummary?.assistiveDevices],["Referred By",resident.referredBy]].filter(([,v])=>v&&v!=="Not specified").map(([k,v])=>(
                  <span key={k} style={{ background:"#f0f4ff", borderRadius:20, padding:"3px 10px", fontSize:11, color:"#4a6490" }}><strong>{k}:</strong> {v}</span>
                ))}
              </div>
              {d.clientSummary?.referralReason && (
                <div style={{ marginTop:11, fontSize:13, color:"#444", lineHeight:1.55, borderLeft:`3px solid ${BLUE}`, paddingLeft:10 }}>{d.clientSummary.referralReason}</div>
              )}
            </div>
            <div style={{ textAlign:"center", padding:"10px 18px", background:priorityBg(d.clientSummary?.overallRisk), borderRadius:12, border:`2px solid ${riskColor}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#999", textTransform:"uppercase", letterSpacing:0.5 }}>Overall Risk</div>
              <div style={{ fontSize:26, fontWeight:900, color:riskColor, margin:"3px 0" }}>{d.clientSummary?.overallRisk}</div>
              <div style={{ fontSize:11, color:"#666", maxWidth:110, lineHeight:1.3 }}>{d.clientSummary?.overallRiskNote}</div>
            </div>
          </div>
        </div>

        {/* Priority risks */}
        {d.priorityRisks?.length>0 && (
          <div style={{ background:"#fff", borderRadius:14, padding:"18px 22px", boxShadow:"0 2px 10px rgba(0,0,0,0.05)", marginBottom:18 }}>
            <div style={{ fontWeight:800, fontSize:14, color:"#1a1a2e", marginBottom:12, display:"flex", alignItems:"center", gap:7 }}>⚠️ Priority Risk Summary</div>
            {d.priorityRisks.map((r,i)=>(
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"9px 13px", borderRadius:8, background:priorityBg(r.priority), borderLeft:`3px solid ${priorityColor(r.priority)}`, marginBottom:7 }}>
                <span style={{ fontSize:10, fontWeight:800, color:priorityColor(r.priority), textTransform:"uppercase", minWidth:65, paddingTop:2 }}>{r.priority}</span>
                <div style={{ flex:1, fontSize:13, color:"#333" }}><strong>{r.area}:</strong> {r.issue}</div>
                <div style={{ fontSize:12, color:GREEN, fontWeight:600, maxWidth:190, textAlign:"right", flexShrink:0 }}>→ {r.recommendation}</div>
              </div>
            ))}
          </div>
        )}

        {/* Room cards */}
        {d.rooms?.length>0 && (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontWeight:800, fontSize:14, color:"#1a1a2e", marginBottom:13, display:"flex", alignItems:"center", gap:7 }}>🏠 Room-by-Room Assessment</div>
            {d.rooms.map((room,i)=><RoomCard key={i} room={room} photos={sectionPhotos[room.id]}/>)}
          </div>
        )}

        {/* Action plan */}
        {d.actionPlan && (
          <div style={{ background:"#fff", borderRadius:14, padding:"18px 22px", boxShadow:"0 2px 10px rgba(0,0,0,0.05)", marginBottom:18 }}>
            <div style={{ fontWeight:800, fontSize:14, color:"#1a1a2e", marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>📋 Action Plan</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(210px, 1fr))", gap:12 }}>
              {[{key:"immediate",label:"Immediate",color:RED,bg:"#fdf0ef",icon:"🔴"},{key:"nearTerm",label:"Near-Term",color:ORANGE,bg:"#fff4ec",icon:"🟠"},{key:"longTerm",label:"Long-Term",color:GREEN,bg:"#edf7f0",icon:"🟢"}].map(({key,label,color,bg,icon})=>(
                d.actionPlan[key]?.length>0 && (
                  <div key={key} style={{ background:bg, borderRadius:10, padding:"13px 15px", border:`1px solid ${color}22` }}>
                    <div style={{ fontWeight:800, fontSize:11, color, textTransform:"uppercase", letterSpacing:0.5, marginBottom:9 }}>{icon} {label}</div>
                    {d.actionPlan[key].map((item,i)=>(
                      <div key={i} style={{ display:"flex", gap:6, marginBottom:6, fontSize:13, color:"#333", alignItems:"flex-start" }}>
                        <span style={{ color, flexShrink:0 }}>✓</span>{item}
                      </div>
                    ))}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Closing */}
        {d.closingSummary && (
          <div style={{ background:`linear-gradient(135deg, ${BLUE}08 0%, ${GREEN}10 100%)`, borderRadius:14, padding:"18px 26px", border:`1px solid ${BLUE}20`, marginBottom:18 }}>
            <div style={{ fontWeight:800, fontSize:13, color:BLUE, marginBottom:7 }}>Professional Summary</div>
            <div style={{ fontSize:13, color:"#444", lineHeight:1.7 }}>{d.closingSummary}</div>
          </div>
        )}

        <div style={{ textAlign:"center", padding:"12px", color:"#bbb", fontSize:11 }}>
          TruBlue Home Safety Assessment · {new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})} · Confidential
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [sectionPhotos, setSectionPhotos] = useState({});
  const [reportData, setReportData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showReport, setShowReport] = useState(false);

  const handleChange = (sectionId, fieldId, value) => setFormData(prev=>({...prev,[sectionId]:{...(prev[sectionId]||{}),[fieldId]:value}}));
  const makeChangeHandler = (sectionId) => (fieldId, value) => handleChange(sectionId, fieldId, value);
  const handlePhotosChange = (sectionId, photos) => setSectionPhotos(prev=>({...prev,[sectionId]:photos}));

  const completionPercent = () => {
    let total=0, filled=0;
    sectionConfig.forEach(sec => { sec.fields.forEach(f => { if(f.type==="textarea") return; total++; const val=(formData[sec.id]||{})[f.id]; if(val&&(Array.isArray(val)?val.length>0:val!=="")) filled++; }); });
    return Math.round((filled/total)*100);
  };

  const generateReport = async () => {
    const name = (formData.resident||{}).name;
    if (!name) { setError("Please enter the resident's full name first."); return; }
    setGenerating(true); setError(""); setReportData(null); setShowReport(true);
    try {
      const response = await fetch("/.netlify/functions/generate-report", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ prompt: buildPrompt(formData,sectionPhotos) })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.content.map(c=>c.text||"").join("");
      const clean = raw.replace(/```json|```/g,"").trim();
      setReportData(JSON.parse(clean));
    } catch(e) { setError("Error: "+e.message); setShowReport(false); }
    finally { setGenerating(false); }
  };

  const pct = completionPercent();

  if (showReport && generating) return (
    <div style={{ minHeight:"100vh", background:LIGHT, fontFamily:"Inter, Arial, sans-serif", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"44px 52px", textAlign:"center", boxShadow:"0 4px 30px rgba(0,0,0,0.08)", maxWidth:360 }}>
        <div style={{ fontSize:42, marginBottom:14 }}>🏠</div>
        <div style={{ fontWeight:800, fontSize:19, color:BLUE, marginBottom:7 }}>Generating Report</div>
        <div style={{ color:"#888", fontSize:13, marginBottom:26, lineHeight:1.5 }}>Analyzing assessment data and preparing your Home Safety Report...</div>
        <div style={{ display:"flex", justifyContent:"center" }}>
          <div style={{ width:38, height:38, border:`4px solid ${GREEN}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (showReport && reportData) return <ReportView reportData={reportData} formData={formData} sectionPhotos={sectionPhotos} onBack={()=>setShowReport(false)} onRegenerate={generateReport}/>;

  const sec = sectionConfig[activeSection];

  return (
    <div style={{ minHeight:"100vh", background:LIGHT, fontFamily:"Inter, Arial, sans-serif", display:"flex", flexDirection:"column" }}>
      <div style={{ background:BLUE, padding:"12px 20px", display:"flex", alignItems:"center", gap:13, flexShrink:0 }}>
        <div style={{ background:"#fff", borderRadius:6, padding:"3px 9px", fontWeight:900, color:BLUE, fontSize:13 }}>TruBlue</div>
        <div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>Home Safety Assessment</div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11 }}>Complete each section · add photos · generate report</div>
        </div>
        <div style={{ marginLeft:"auto", textAlign:"right" }}>
          <div style={{ color:"rgba(255,255,255,0.65)", fontSize:11, marginBottom:3 }}>Progress</div>
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:20, height:6, width:120, overflow:"hidden" }}>
            <div style={{ background:GREEN, height:"100%", width:`${pct}%`, borderRadius:20, transition:"width 0.4s" }}/>
          </div>
          <div style={{ color:"rgba(255,255,255,0.75)", fontSize:11, marginTop:2 }}>{pct}%</div>
        </div>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        <div style={{ width:200, background:"#fff", borderRight:"1px solid #e8eaed", overflowY:"auto", flexShrink:0 }}>
          {sectionConfig.map((s,i) => {
            const photoCount = s.hasPhotos ? (sectionPhotos[s.id]||[]).length : 0;
            return (
              <button key={s.id} onClick={()=>setActiveSection(i)}
                style={{ width:"100%", textAlign:"left", padding:"11px 13px", border:"none", background:i===activeSection?"#e8eef7":"transparent", borderLeft:`3px solid ${i===activeSection?BLUE:"transparent"}`, cursor:"pointer", display:"flex", alignItems:"center", gap:8, color:i===activeSection?BLUE:"#555", fontWeight:i===activeSection?700:400, fontSize:12, transition:"all 0.12s" }}>
                <span style={{ fontSize:14 }}>{s.icon}</span>
                <span style={{ flex:1, lineHeight:1.3 }}>{s.label}</span>
                {photoCount>0 && <span style={{ fontSize:10, background:BLUE, color:"#fff", borderRadius:10, padding:"1px 5px" }}>📷{photoCount}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          <div style={{ maxWidth:660 }}>
            <div style={{ marginBottom:16 }}>
              <h2 style={{ margin:0, color:BLUE, fontSize:18, fontWeight:800 }}>{sec.icon} {sec.label}</h2>
              <div style={{ color:"#aaa", fontSize:12, marginTop:2 }}>Section {activeSection+1} of {sectionConfig.length}</div>
            </div>
            <div style={{ background:"#fff", borderRadius:12, padding:"18px 20px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <SectionForm section={sec} data={formData[sec.id]||{}} onChange={makeChangeHandler(sec.id)} photos={sectionPhotos[sec.id]||[]} onPhotosChange={handlePhotosChange}/>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:16, alignItems:"center" }}>
              <button onClick={()=>setActiveSection(Math.max(0,activeSection-1))} disabled={activeSection===0}
                style={{ padding:"8px 18px", borderRadius:8, border:`1.5px solid ${BLUE}`, background:"#fff", color:BLUE, cursor:activeSection===0?"not-allowed":"pointer", fontWeight:600, fontSize:13, opacity:activeSection===0?0.35:1 }}>← Previous</button>
              {activeSection<sectionConfig.length-1 ? (
                <button onClick={()=>setActiveSection(activeSection+1)} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:BLUE, color:"#fff", cursor:"pointer", fontWeight:600, fontSize:13 }}>Next →</button>
              ) : (
                <button onClick={generateReport} style={{ padding:"9px 22px", borderRadius:8, border:"none", background:GREEN, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:14, boxShadow:"0 3px 10px rgba(91,173,114,0.3)" }}>Generate Report ✨</button>
              )}
            </div>
            {activeSection===sectionConfig.length-1 && (
              <button onClick={generateReport} style={{ marginTop:12, width:"100%", padding:"13px", borderRadius:10, border:"none", background:GREEN, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:14, boxShadow:"0 4px 14px rgba(91,173,114,0.32)" }}>🏠 Generate Home Safety Report</button>
            )}
            {error && <div style={{ marginTop:10, background:"#fff0ec", border:`1.5px solid ${ORANGE}`, borderRadius:8, padding:11, color:"#c0392b", fontSize:13 }}>{error}</div>}
          </div>
        </div>
      </div>

      {activeSection<sectionConfig.length-1 && pct>=25 && (
        <div style={{ position:"fixed", bottom:20, right:20, zIndex:100 }}>
          <button onClick={generateReport} style={{ background:GREEN, color:"#fff", border:"none", borderRadius:50, padding:"12px 18px", cursor:"pointer", fontWeight:700, fontSize:13, boxShadow:"0 4px 16px rgba(91,173,114,0.4)" }}>✨ Generate Report</button>
        </div>
      )}
    </div>
  );
}
