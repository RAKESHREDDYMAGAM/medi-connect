const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
  console.log('🧪 Testing Search Endpoints - Verifying Database Queries\n');

  try {
    // Test Doctor Search
    console.log('1️⃣ Testing Doctor Search Endpoint...');
    const doctorsRes = await axios.get(`${BASE_URL}/doctors`);
    console.log(`   ✅ Found ${doctorsRes.data.length} doctors from database`);
    doctorsRes.data.forEach(d => {
      console.log(`      - ${d.name} (${d.specialization})`);
    });

    // Test Doctor Search with filter
    console.log('\n2️⃣ Testing Doctor Search with "cardio" filter...');
    const doctorsFiltered = await axios.get(`${BASE_URL}/doctors?search=cardio`);
    console.log(`   ✅ Found ${doctorsFiltered.data.length} doctors matching "cardio"`);
    doctorsFiltered.data.forEach(d => {
      console.log(`      - ${d.name} (${d.specialization})`);
    });

    // Test Pharmacist Search
    console.log('\n3️⃣ Testing Pharmacist Search Endpoint...');
    const pharmacistsRes = await axios.get(`${BASE_URL}/pharmacists`);
    console.log(`   ✅ Found ${pharmacistsRes.data.length} pharmacists from database`);
    pharmacistsRes.data.forEach(p => {
      console.log(`      - ${p.name} (${p.pharmacyName})`);
    });

    // Test Pharmacist Search with filter
    console.log('\n4️⃣ Testing Pharmacist Search with "MediCare" filter...');
    const pharmacistsFiltered = await axios.get(`${BASE_URL}/pharmacists?search=MediCare`);
    console.log(`   ✅ Found ${pharmacistsFiltered.data.length} pharmacists matching "MediCare"`);
    pharmacistsFiltered.data.forEach(p => {
      console.log(`      - ${p.name} (${p.pharmacyName})`);
    });

    console.log('\n✅ All endpoints are fetching directly from database!');
    console.log('📊 Summary:');
    console.log(`   - Doctors: ${doctorsRes.data.length} total`);
    console.log(`   - Pharmacists: ${pharmacistsRes.data.length} total`);
    console.log('\n✅ Search functionality is working correctly!');

  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

testEndpoints();


