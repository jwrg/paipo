INSERT INTO json (date, data) VALUES 
( 
  NOW() + INTERVAL '1 DAY', 
 '{
    "name": "Person", 
    "age": "Ninety-nine"
  }' 
),
( 
  NOW() + INTERVAL '7 DAY',
 '{
    "name": "Person 2", 
    "sport": "Murderball"
  }'
),
( 
  NOW() + INTERVAL '3 DAY',
 '{
    "name": "Person 3", 
    "schtick": "Ventriloquism"
  }'
),
( 
  NOW() - INTERVAL '1 DAY',
 '{
    "name": "Person 4", 
    "hates": "Mustard"
  }'
),
( 
  NOW() - INTERVAL '5 DAY',  
 '{
    "name": "Ric", 
    "nickname": "Nature Boy", 
    "catchphrase": "WOOOOOOOOO"
  }'
),
( 
  NOW() - INTERVAL '3 DAY',
 '{
    "name": "Kuro-Chan", 
    "Eats": 
    {
      "Favourite": "Chikin",
      "Second favourite": "Italian food",
      "Daisuki desu": "Rice double portion",
      "Kinda unpalatable": "Vegetables",
      "Kinda good everywhere": "Frog legs"
    },
    "Coming soon": "To a concealed pit near you"
  }'
),
( 
  NOW() + INTERVAL '5 DAY',
 '{
    "name": "Ricky", 
    "Professions":
    {
      "Most of the time": "Growing dope",
      "Some of the time":
      {
        "Vocational School":
        {
          "During school hours": "Custodial arts",
          "After hours": "Leave hash in the lockers",
          "Anyone asks": "Different things"
        },
        "Stealing":[ "Meat", "Barbecues", "Groceries", "Lawn mowers", "Wheels" ],
        "Banging": "Lucy",
        "Otherwise": "I can''t think of anything else but I am smart"
      }
    }
  }'
)
;
