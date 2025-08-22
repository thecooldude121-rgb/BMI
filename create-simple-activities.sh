#!/bin/bash

echo "Creating activities for all deals..."

# Deal IDs and titles
declare -a deals=(
  "6a22c833-4608-4b56-bea7-d89d92d481a8:Enterprise Software License"
  "e30eeaab-6243-4564-bf04-f8c6f1523f6c:Cloud Migration Project"
  "745596d5-e0a3-42f4-b039-4a53568fade7:Digital Transformation Initiative"
  "4e26dc11-1701-4434-887d-8db141b96ed5:CRM Implementation"
  "7048bfca-7697-4b36-a52f-1f99ddb26ce2:Business Intelligence Platform"
  "00771666-8d63-43e5-a87d-248f5c43db6f:Security Consulting Engagement"
  "9f7e2936-f789-4875-aa49-369311092860:Marketing Automation Setup"
  "c8fb976d-4243-49c2-addc-382a88eee7d7:Data Analytics Solution"
  "7849b1be-c112-490f-b6bb-08be076c6810:Mobile App Development"
  "d1bc4194-2feb-4631-8459-155005a00204:Infrastructure Modernization"
)

count=0

for deal in "${deals[@]}"; do
  IFS=':' read -r deal_id deal_title <<< "$deal"
  echo "Creating activities for: $deal_title"
  
  # Completed Call
  echo "  - Creating completed call..."
  curl -X POST http://localhost:5000/api/activities \
    -H "Content-Type: application/json" \
    -d "{
      \"subject\": \"Initial Discovery Call - $deal_title\",
      \"type\": \"call\",
      \"description\": \"Completed initial discovery call. Identified key requirements and decision makers. Positive feedback received.\",
      \"status\": \"completed\",
      \"priority\": \"medium\",
      \"relatedToType\": \"deal\",
      \"relatedToId\": \"$deal_id\",
      \"dealId\": \"$deal_id\"
    }" --silent --output /dev/null
  ((count++))
  
  # Planned Call
  echo "  - Creating planned call..."
  curl -X POST http://localhost:5000/api/activities \
    -H "Content-Type: application/json" \
    -d "{
      \"subject\": \"Follow-up Discussion - $deal_title\",
      \"type\": \"call\",
      \"description\": \"Scheduled follow-up call to address technical questions and discuss next steps.\",
      \"status\": \"planned\",
      \"priority\": \"high\",
      \"relatedToType\": \"deal\",
      \"relatedToId\": \"$deal_id\",
      \"dealId\": \"$deal_id\"
    }" --silent --output /dev/null
  ((count++))
  
  # Completed Task
  echo "  - Creating completed task..."
  curl -X POST http://localhost:5000/api/activities \
    -H "Content-Type: application/json" \
    -d "{
      \"subject\": \"Research and Analysis - $deal_title\",
      \"type\": \"task\",
      \"description\": \"Completed comprehensive research on client background and competitive landscape.\",
      \"status\": \"completed\",
      \"priority\": \"medium\",
      \"relatedToType\": \"deal\",
      \"relatedToId\": \"$deal_id\",
      \"dealId\": \"$deal_id\"
    }" --silent --output /dev/null
  ((count++))
  
  # Planned Task
  echo "  - Creating planned task..."
  curl -X POST http://localhost:5000/api/activities \
    -H "Content-Type: application/json" \
    -d "{
      \"subject\": \"Prepare Proposal - $deal_title\",
      \"type\": \"task\",
      \"description\": \"Create comprehensive proposal document including pricing, timeline, and implementation plan.\",
      \"status\": \"planned\",
      \"priority\": \"high\",
      \"relatedToType\": \"deal\",
      \"relatedToId\": \"$deal_id\",
      \"dealId\": \"$deal_id\"
    }" --silent --output /dev/null
  ((count++))
  
  # Completed Meeting
  echo "  - Creating completed meeting..."
  curl -X POST http://localhost:5000/api/activities \
    -H "Content-Type: application/json" \
    -d "{
      \"subject\": \"Stakeholder Meeting - $deal_title\",
      \"type\": \"meeting\",
      \"description\": \"Successful meeting with key stakeholders. Demonstrated product capabilities and addressed concerns.\",
      \"status\": \"completed\",
      \"priority\": \"high\",
      \"relatedToType\": \"deal\",
      \"relatedToId\": \"$deal_id\",
      \"dealId\": \"$deal_id\"
    }" --silent --output /dev/null
  ((count++))
  
  # Planned Meeting
  echo "  - Creating planned meeting..."
  curl -X POST http://localhost:5000/api/activities \
    -H "Content-Type: application/json" \
    -d "{
      \"subject\": \"Executive Review - $deal_title\",
      \"type\": \"meeting\",
      \"description\": \"Executive review meeting to finalize contract terms and discuss implementation timeline.\",
      \"status\": \"planned\",
      \"priority\": \"high\",
      \"relatedToType\": \"deal\",
      \"relatedToId\": \"$deal_id\",
      \"dealId\": \"$deal_id\"
    }" --silent --output /dev/null
  ((count++))
  
  echo "  ✓ Created 6 activities for $deal_title"
  echo ""
done

echo "Completed! Created $count activities for ${#deals[@]} deals."