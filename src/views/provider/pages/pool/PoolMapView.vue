I'll fix the pool details popup showing behind the map by adjusting the z-index and popup behavior. Here's the updated code:

```vue
<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pool Map View</h1>
        <p class="text-sm text-gray-500 mt-0.5">View customer pools geographically and optimize service routes.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Export Locations
        </button>
        <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Add Pool
        </button>
        <button class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          Create Route
        </button>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar -->
      <aside class="w-[350px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <!-- Search -->
        <div class="p-4 border-b border-gray-100">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search locations..."
              class="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="p-4 border-b border-gray-100 space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Pool Type</label>
              <select v-model="filters.type" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="option in filterOptions.type" :key="option" :value="option === 'All' ? '' : option">
                  {{ option }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
              <select v-model="filters.status" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="option in filterOptions.status" :key="option" :value="option === 'All' ? '' : option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Schedule</label>
              <select v-model="filters.schedule" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="option in filterOptions.schedule" :key="option" :value="option === 'All' ? '' : option">
                  {{ option }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Technician</label>
              <select v-model="filters.technician" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="option in filterOptions.technician" :key="option" :value="option === 'All' ? '' : option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Pool List -->
        <div class="flex-1 overflow-y-auto p-3 space-y-2.5">
          <!-- Loading State -->
          <div v-if="loading" class="space-y-3">
            <div v-for="n in 4" :key="n" class="bg-gray-100 rounded-xl p-4 animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredLocations.length === 0" class="flex flex-col items-center justify-center h-full text-center p-6">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900">No locations found</h3>
            <p class="text-sm text-gray-500 mt-1">Try adjusting your filters or search criteria.</p>
          </div>

          <!-- Pool Cards -->
          <div v-else>
            <div
              v-for="location in filteredLocations"
              :key="location.id"
              @click="selectPoolFromSidebar(location)"
              class="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
              :class="{ 'ring-2 ring-blue-500 bg-blue-50': selectedLocation?.id === location.id }"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">🏊</span>
                    <h4 class="font-medium text-gray-900 truncate">{{ location.pool }}</h4>
                  </div>
                  <p class="text-sm text-gray-500 truncate">{{ location.customer }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ location.address }}</p>
                </div>
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2"
                  :class="statusColor(location.status)"
                >
                  {{ location.status }}
                </span>
              </div>
              <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span>👤 {{ location.technician }}</span>
                <span>📅 {{ formatDate(location.next_service) }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Map Area -->
      <div class="flex-1 relative bg-gray-100">
        <!-- Statistics Overlay -->
        <div class="absolute top-4 left-4 right-4 z-10 grid grid-cols-4 gap-3 pointer-events-none">
          <div v-for="(stat, key) in stats" :key="key" class="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-gray-200/50 pointer-events-auto">
            <p class="text-xs text-gray-500 uppercase tracking-wide">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</p>
            <p class="text-xl font-bold text-gray-900">{{ stat }}</p>
          </div>
        </div>

        <!-- Map Container -->
        <div id="map-container" class="w-full h-full relative" ref="mapContainer">
          <!-- Map will be rendered here by Leaflet -->
        </div>

        <!-- Map Controls -->
        <div class="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          <button @click="zoomIn" class="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 text-gray-700 font-medium text-lg">+</button>
          <button @click="zoomOut" class="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 text-gray-700 font-medium text-lg">−</button>
          <button @click="resetMap" class="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 text-gray-700">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </button>
          <button @click="toggleHeatmap" class="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 text-gray-700">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"/></svg>
          </button>
        </div>

        <!-- Route Planning Toolbar -->
        <div v-if="selectedPools.length > 0" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-xl shadow-2xl border border-gray-200 px-6 py-3 flex items-center gap-6">
          <span class="text-sm font-medium text-gray-700">{{ selectedPools.length }} Pools Selected</span>
          <div class="h-6 w-px bg-gray-200"></div>
          <button class="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Create Route</button>
          <button class="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Assign Technician</button>
          <button class="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Optimize Route</button>
        </div>
      </div>
    </div>

    <!-- Details Drawer - FIXED: Higher z-index and proper positioning -->
    <div v-if="drawerOpen && selectedLocation" class="fixed inset-0 z-[9999] overflow-hidden">
      <div class="absolute inset-0 bg-black/50" @click="closeDrawer"></div>
      <div class="absolute right-0 top-0 h-full w-[420px] bg-white shadow-2xl transform transition-transform duration-300 ease-out" :class="drawerOpen ? 'translate-x-0' : 'translate-x-full'">
        <div class="p-6 h-full overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Pool Details</h2>
            <button @click="closeDrawer" class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Customer Information -->
          <div class="mb-6">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h3>
            <div class="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div class="flex justify-between"><span class="text-gray-500">Name</span><span class="font-medium">{{ selectedLocation.customer }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Phone</span><span class="font-medium">+1 (555) 123-4567</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Email</span><span class="font-medium">{{ selectedLocation.customer.toLowerCase().replace(' ', '.') }}@example.com</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Address</span><span class="font-medium">{{ selectedLocation.address }}</span></div>
            </div>
          </div>

          <!-- Pool Information -->
          <div class="mb-6">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Pool Information</h3>
            <div class="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div class="flex justify-between"><span class="text-gray-500">Pool Type</span><span class="font-medium">{{ selectedLocation.type }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Size</span><span class="font-medium">14 x 28 ft</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Water Type</span><span class="font-medium">Chlorine</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Equipment Count</span><span class="font-medium">5</span></div>
            </div>
          </div>

          <!-- Service Information -->
          <div>
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Service Information</h3>
            <div class="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div class="flex justify-between"><span class="text-gray-500">Agreement</span><span class="font-medium">Weekly Service</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Technician</span><span class="font-medium">{{ selectedLocation.technician }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Next Visit</span><span class="font-medium">{{ formatDate(selectedLocation.next_service) }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Last Service</span><span class="font-medium">June 20, 2026</span></div>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Create Route</button>
            <button class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Edit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Mock Data
const locations = ref([
  {
    id: 'POOL-1001',
    customer: 'John Smith',
    pool: 'Backyard Pool',
    address: '245 Ocean Drive, Miami FL',
    latitude: 25.7617,
    longitude: -80.1918,
    type: 'Residential',
    status: 'Active',
    technician: 'Mike Carter',
    next_service: '2026-06-27'
  },
  {
    id: 'POOL-1002',
    customer: 'Sarah Johnson',
    pool: 'Villa Main Pool',
    address: '890 Palm Ave, Miami FL',
    latitude: 25.775,
    longitude: -80.185,
    type: 'Residential',
    status: 'Maintenance Required',
    technician: 'Alex Green',
    next_service: '2026-06-25'
  },
  {
    id: 'POOL-1003',
    customer: 'Ocean Resort',
    pool: 'Main Hotel Pool',
    address: '500 Beach Road Miami FL',
    latitude: 25.790,
    longitude: -80.130,
    type: 'Commercial',
    status: 'Active',
    technician: 'David Ross',
    next_service: '2026-06-28'
  },
  {
    id: 'POOL-1004',
    customer: 'Robert Chen',
    pool: 'Garden Spa',
    address: '1234 Orchid Blvd, Miami FL',
    latitude: 25.755,
    longitude: -80.165,
    type: 'Spa',
    status: 'Active',
    technician: 'Mike Carter',
    next_service: '2026-06-26'
  },
  {
    id: 'POOL-1005',
    customer: 'Harbor Hotel',
    pool: 'Executive Pool',
    address: '88 Marina Way, Miami FL',
    latitude: 25.785,
    longitude: -80.150,
    type: 'Hotel',
    status: 'Inactive',
    technician: 'David Ross',
    next_service: '2026-07-02'
  }
])

// State
const loading = ref(false)
const searchQuery = ref('')
const selectedLocation = ref(null)
const drawerOpen = ref(false)
const selectedPools = ref([])
const mapContainer = ref(null)
let map = null
let markerCluster = null

const filters = ref({
  type: '',
  status: '',
  schedule: '',
  technician: ''
})

const filterOptions = {
  type: ['All', 'Residential', 'Commercial', 'Spa', 'Hotel'],
  status: ['All', 'Active', 'Maintenance Required', 'Inactive'],
  schedule: ['All', 'Today', 'This Week', 'Overdue'],
  technician: ['All', 'Mike Carter', 'Alex Green', 'David Ross']
}

// Stats
const stats = computed(() => ({
  'Total Pools': locations.value.length,
  'Active': locations.value.filter(l => l.status === 'Active').length,
  'Needs Attention': locations.value.filter(l => l.status === 'Maintenance Required').length,
  "Today's Visits": 24
}))

// Computed
const filteredLocations = computed(() => {
  return locations.value.filter(location => {
    // Search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matches = location.customer.toLowerCase().includes(query) ||
        location.pool.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query) ||
        location.technician.toLowerCase().includes(query)
      if (!matches) return false
    }

    // Type
    if (filters.value.type && location.type !== filters.value.type) return false

    // Status
    if (filters.value.status && location.status !== filters.value.status) return false

    // Technician
    if (filters.value.technician && location.technician !== filters.value.technician) return false

    // Schedule (simplified mock)
    if (filters.value.schedule) {
      if (filters.value.schedule === 'Today') {
        const today = new Date().toISOString().split('T')[0]
        if (location.next_service !== today) return false
      } else if (filters.value.schedule === 'This Week') {
        const nextDate = new Date(location.next_service)
        const now = new Date()
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 7)
        if (nextDate < weekStart || nextDate > weekEnd) return false
      } else if (filters.value.schedule === 'Overdue') {
        if (new Date(location.next_service) >= new Date()) return false
      }
    }

    return true
  })
})

// Methods
const statusColor = (status) => {
  const colors = {
    'Active': 'bg-green-100 text-green-700',
    'Maintenance Required': 'bg-orange-100 text-orange-700',
    'Inactive': 'bg-gray-100 text-gray-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// Toggle pool selection
const togglePoolSelection = (poolId) => {
  const index = selectedPools.value.indexOf(poolId)
  if (index > -1) {
    selectedPools.value.splice(index, 1)
  } else {
    selectedPools.value.push(poolId)
  }
}

// Open drawer with selected location
const openDrawer = (location) => {
  selectedLocation.value = location
  drawerOpen.value = true
  // Close any open popups on the map
  if (map) {
    map.closePopup()
  }
}

// Close drawer
const closeDrawer = () => {
  drawerOpen.value = false
  // Small delay to clear the selected location after animation
  setTimeout(() => {
    if (!drawerOpen.value) {
      // Don't clear selectedLocation immediately to prevent flicker
    }
  }, 300)
}

// Select pool from sidebar
const selectPoolFromSidebar = (location) => {
  openDrawer(location)
  // Zoom to the location on map
  if (map) {
    map.setView([location.latitude, location.longitude], 15)
  }
}

// Map functions
const initMap = () => {
  if (!mapContainer.value) return

  // Initialize map with OpenStreetMap tiles
  map = L.map(mapContainer.value, {
    center: [25.7617, -80.1918],
    zoom: 13,
    zoomControl: false
  })

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map)

  // Create marker cluster group
  const markerGroup = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 50
  })

  // Add markers
  locations.value.forEach(location => {
    const marker = L.marker([location.latitude, location.longitude], {
      icon: getMarkerIcon(location.status)
    })

    // Create popup
    const popupContent = `
      <div class="p-2 min-w-[200px]">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-lg">🏊</span>
          <h4 class="font-bold text-gray-900">${location.pool}</h4>
        </div>
        <p class="text-sm text-gray-600">${location.customer}</p>
        <p class="text-xs text-gray-500">${location.type}</p>
        <div class="mt-2 text-xs text-gray-500">
          <div>Next Service: ${formatDate(location.next_service)}</div>
          <div>Technician: ${location.technician}</div>
        </div>
        <button 
          onclick="window.openPoolDetails('${location.id}')"
          class="mt-2 w-full px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          View Details
        </button>
      </div>
    `
    marker.bindPopup(popupContent)

    marker.on('click', () => {
      openDrawer(location)
    })

    markerGroup.addLayer(marker)
  })

  markerCluster = markerGroup
  map.addLayer(markerGroup)

  // Click on map to close drawer
  map.on('click', () => {
    if (drawerOpen.value) {
      closeDrawer()
    }
  })
}

const getMarkerIcon = (status) => {
  const colors = {
    'Active': '#22c55e',
    'Maintenance Required': '#f97316',
    'Inactive': '#9ca3af'
  }
  const color = colors[status] || '#22c55e'

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:${color};width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);font-size:12px;">📍</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

const zoomIn = () => {
  if (map) map.zoomIn()
}

const zoomOut = () => {
  if (map) map.zoomOut()
}

const resetMap = () => {
  if (map) {
    map.setView([25.7617, -80.1918], 13)
  }
}

const toggleHeatmap = () => {
  alert('Heatmap feature would toggle here. You can add a heatmap library like Leaflet.heat.')
}

// Watch for filter changes to update markers
watch(filteredLocations, (newLocations) => {
  if (!map) return

  // Clear existing markers
  if (markerCluster) {
    map.removeLayer(markerCluster)
  }

  // Create new marker cluster
  const markerGroup = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 50
  })

  newLocations.forEach(location => {
    const marker = L.marker([location.latitude, location.longitude], {
      icon: getMarkerIcon(location.status)
    })

    const popupContent = `
      <div class="p-2 min-w-[200px]">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-lg">🏊</span>
          <h4 class="font-bold text-gray-900">${location.pool}</h4>
        </div>
        <p class="text-sm text-gray-600">${location.customer}</p>
        <p class="text-xs text-gray-500">${location.type}</p>
        <div class="mt-2 text-xs text-gray-500">
          <div>Next Service: ${formatDate(location.next_service)}</div>
          <div>Technician: ${location.technician}</div>
        </div>
        <button 
          onclick="window.openPoolDetails('${location.id}')"
          class="mt-2 w-full px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          View Details
        </button>
      </div>
    `
    marker.bindPopup(popupContent)

    marker.on('click', () => {
      openDrawer(location)
    })

    markerGroup.addLayer(marker)
  })

  markerCluster = markerGroup
  map.addLayer(markerGroup)

  // Fit bounds if there are markers
  if (newLocations.length > 0) {
    const bounds = L.latLngBounds(newLocations.map(l => [l.latitude, l.longitude]))
    map.fitBounds(bounds, { padding: [50, 50] })
  }
})

// Expose openPoolDetails to window for popup buttons
window.openPoolDetails = (id) => {
  const location = locations.value.find(l => l.id === id)
  if (location) {
    openDrawer(location)
  }
}

// Lifecycle
onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
  delete window.openPoolDetails
})
</script>

<style scoped>
/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Map container base styles */
#map-container {
  background: #e8ecf1;
}

/* Leaflet popup customization */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 1000 !important;
}

:deep(.leaflet-popup-content) {
  margin: 0;
  padding: 0;
}

:deep(.leaflet-popup-tip) {
  background: white;
}

/* Ensure Leaflet popup is above map but below drawer */
:deep(.leaflet-popup) {
  z-index: 900 !important;
}

:deep(.leaflet-popup-pane) {
  z-index: 900 !important;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Override Leaflet's default control z-index */
.leaflet-control-zoom {
  display: none !important;
}

/* Drawer animation */
.fixed.inset-0 {
  z-index: 9999 !important;
}

/* Ensure drawer content is above everything */
.absolute.right-0 {
  z-index: 10000 !important;
}
</style>
```

## Key Fixes Made:

1. **Increased z-index for drawer**: Set to `z-[9999]` and `z-[10000]` to ensure it appears above all map elements.

2. **Added backdrop overlay**: Semi-transparent black overlay (`bg-black/50`) to visually separate the drawer from the map.

3. **Map popup z-index**: Set Leaflet popups to `z-index: 900` to keep them below the drawer but above the map.

4. **Click outside to close**: Clicking on the backdrop or the map closes the drawer.

5. **Smooth animations**: Added CSS transitions for the drawer slide-in effect.

6. **Popup button handler**: Updated the popup "View Details" button to use the drawer instead of a separate popup.

7. **Sidebar interaction**: Clicking a pool in the sidebar now opens the drawer and zooms to the location.

8. **Close popups when opening drawer**: Automatically closes any open map popups when the drawer opens to prevent conflicts.

The pool details drawer now appears above the map with proper layering and a clean user experience.