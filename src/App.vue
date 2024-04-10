<template>
  <!-- Estrutura principal -->
  <main
    class="xs:h-dvh sm:h-dvh bg-gradient-to-br from-cyan-500 to-cyan-900 dark:from-neutral-900 dark:to-neutral-950 flex justify-center items-center">
    <!-- Seção do conteúdo -->
    <section
      class="xs:w-[90%] xs:h-[80%] sm:w-[80%] sm:h-[70%] landscape:h-[80%] lg:landscape:h-[70%] lg:w-[80%] 2xl:max-w-[80em] dark:shadow-isDark shadow-isLight rounded-3xl flex flex-col justify-start items-center font-ubuntu sm:px-[12.5%] 2xl:px-[7.5%]">

      <!-- Input para inserir o nome da cidade -->
      <div class="flex gap-x-3 xs:pt-6 sm:pt-8 2xl:pt-10 z-50 lg:w-[60%] xl: 2xl:w-[60%]">
        <input v-model="cityName" @keydown="handleKeyPress"
          class="bg-transparent placeholder:text-sm xl:text-lg xl:placeholder:text-base landscape:text-sm 2xl:text-xl placeholder:text-neutral-500 text-neutral-50 rounded-full w-4/5 pl-3 2xl:pl-6 outline outline-2 outline-neutral-50 font-outfit"
          placeholder="Insira o nome da cidade">

        <!-- Botão para acionar a busca do clima -->
        <button @click="searchWeather" @keydown="handleKeyPress"
          class="border-2 rounded-full p-2 lg:p-2 2xl:p-3 hover:bg-white group">
          <img src="./assets/search.png" class="xs:w-5 landscape:w-3 2xl:w-7 group-hover:invert" alt="">
        </button>
      </div>

      <!-- Exibição do nome da cidade -->
      <div
        class="flex-col justify-center items-center hidden absolute translate-y-1/2 lg:top-[35%] 2xl:top-[32.5%] lg:flex"
        v-if="weatherData">
        <h2 class="text-xl lg:text-3xl 2xl:text-4xl font-medium pb-3 text-neutral-50 font-outfit">{{ weatherData.name +
          ', ' + weatherData.sys.country }}</h2>
      </div>

      <!-- Mensagem de carregamento -->
      <div v-if="isLoading"
        class="translate-x-1/2 translate-y-1/2 top-1/2 right-1/2 absolute bg-neutral-50 p-4 text-neutral-900 rounded-lg">
        Carregando...
      </div>

      <!-- Seção de exibição dos dados do clima -->
      <section v-if="weatherData"
        class="text-neutral-50 flex flex-col xs:-mt-8 landscape:flex-row 2xl:w-full justify-center 2xl:justify-between landscape: gap-x-2 lg:landscape:gap-x-10 items-center h-full sm:-mt-10 md:-mt-4">
        <!-- Imagem do clima -->
        <div class="flex-col flex justify-center items-center">
          <h2 class="text-xl 2xl:text-4xl font-medium pb-3 text-neutral-50 font-outfit lg:hidden">{{ weatherData.name +
          ', ' + weatherData.sys.country }}</h2>
          <img v-if="image" :src="`./assets/${image}`" class="w-28 lg:w-36 2xl:w-56 object-contain hidden lg:flex"
            alt="Imagem do clima">
        </div>

        <!-- Temperatura atual -->
        <div class="flex items-center justify-center gap-x-2 md:gap-x-4 w-full lg:hidden">
          <img v-if="image" :src="`./assets/${image}`"
            class="w-20 md:w-32 lg:w-36 lg:hidden rounded-lg flex 2xl:w-56 object-contain" alt="Imagem do clima">
          <p class="text-7xl md:text-9xl lg:hidden font-outfit font-medium leading-[1.1em]">{{
          Math.round(weatherData.main.temp) }}°C</p>
        </div>

        <!-- Temperatura atual e detalhes -->
        <div class="lg:flex-col lg:justify-center lg:items-center lg:text-center lg:-ml-2">
          <p class="text-7xl lg:text-8xl 2xl:text-[11em] lg:flex hidden font-outfit">{{
          Math.round(weatherData.main.temp) }}°C</p>
          <div
            class="flex justify-center items-center pt-1 md:pt-5 gap-x-6 font-outfit font-light md:text-xl lg:text-sm 2xl:text-2xl lg:text-center lg:ml-1.5">
            <h2>Min: {{ Math.round(weatherData.main.temp_min) }}°C</h2>
            <h2>Max: {{ Math.round(weatherData.main.temp_max) }}°C</h2>
          </div>
        </div>

        <!-- Detalhes adicionais do clima -->
        <ul
          class="flex flex-col items-start lg:justify-center gap-y-6 lg:min-w-20 lg:max-w-36 2xl:max-w-60 lg:mt-0 mt-10 md:mt-12 sm:text-sm md:text-lg lg:text-xs 2xl:text-xl font-outfit">
          <li class="flex justify-center items-center gap-1.5">
            <img src="./assets/humidity.png" class="object-contain w-4" alt="">
            <h1>Umidade: {{ weatherData.main.humidity }}%</h1>
          </li>
          <li class="flex justify-center items-center gap-1.5">
            <img src="./assets/info.png" class="object-contain w-4" alt="">
            <h1>Situação climática: {{ weatherData.weather[0].description }}</h1>
          </li>
          <li class="flex justify-center items-center gap-1.5">
            <img src="./assets/wind.png" class="object-contain w-4" alt="">
            <h1>Velocidade do vento: {{ weatherData.wind.speed }}</h1>
          </li>
        </ul>
      </section>

      <!-- Mensagem de erro -->
      <div class="flex w-full h-full text-center justify-center items-center" v-if="error">{{ error }}</div>
    </section>
  </main>
  <!-- Componente do rodapé -->
  <FooterNav />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FooterNav from './components/FooterNav.vue'

// Chave e URL da API do OpenWeatherMap
const apiKey = "7323db4d714dc6c37387765fb648f0c7";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=pt";

// Estados reativos
const isLoading = ref(false);
const weatherData = ref(null);
const error = ref(null);
const image = ref(null);
const cityName = ref(''); // Mantenha cityName reativo para refletir as alterações no template

// Função para definir o tema com base nas preferências do usuário
function setThemeMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Chama a função para definir o tema assim que o componente é montado
onMounted(() => {
  setThemeMode();
});

// Função assíncrona para buscar dados climáticos por coordenadas geográficas
async function fetchWeatherByCoordinates(latitude, longitude) {
  isLoading.value = true; // Define o estado de carregamento como verdadeiro
  try {
    const response = await fetch(`${apiUrl}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
    if (response.ok) {
      const data = await response.json();
      weatherData.value = data;
      image.value = getWeatherImage(data);
      error.value = null;
    } else {
      error.value = "Erro ao buscar dados climáticos. Por favor, tente novamente mais tarde.";
      weatherData.value = null;
      image.value = null;
    }
  } catch (error) {
    error.value = "Ocorreu um erro ao buscar os dados climáticos.";
  } finally {
    isLoading.value = false; // Define o estado de carregamento de volta para falso, independentemente do resultado
  }
}

// Verifica se é dia ou noite com base no horário do nascer e pôr do sol
function isDayTime(data) {
  const now = new Date().getTime() / 1000;
  return data && now >= data.sys.sunrise && now < data.sys.sunset;
}

// Obtém a imagem correspondente ao clima atual
function getWeatherImage(data) {
  const isDay = isDayTime(data);
  const weatherImages = {
    Clear: isDay ? "day.png" : "night.png",
    Clouds: isDay ? "cloudy_day.png" : "cloudy_night.png",
    Rain: isDay ? "rain_day.png" : "rain_night.png",
    Drizzle: isDay ? "rain_day.png" : "rain_night.png",
    Thunderstorm: isDay ? "storm_day.png" : "storm_night.png",
    Snow: isDay ? "snow_day.png" : "snow_night.png",
    Tornado: "tornado.png",
    Mist: "mist.png",
    Smoke: "mist.png",
    Haze: "mist.png",
    Dust: "mist.png",
    Fog: "mist.png",
    Sand: "mist.png",
    Ash: "mist.png",
    Squali: "mist.png",
  };
  return weatherImages[data.weather[0].main];
}

// Chama a função para buscar dados climáticos com base na localização do usuário
onMounted(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      try {
        await fetchWeatherByCoordinates(latitude, longitude);
      } catch (error) {
        console.error("Erro ao buscar dados climáticos:", error);
      }
    }, (error) => {
      console.error("Erro ao obter localização:", error);
    });
  } else {
    console.error("Geolocalização não é suportada pelo seu navegador.");
  }
});

// Função assíncrona para buscar dados climáticos por nome da cidade
async function fetchWeather(city) {
  isLoading.value = true;
  try {
    const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
    if (response.ok) {
      const data = await response.json();
      weatherData.value = data;
      error.value = null;
    } else {
      error.value = "Cidade não encontrada. Verifique o nome da cidade e tente novamente.";
      weatherData.value = null;
    }
  } catch (error) {
    error.value = "Ocorreu um erro ao buscar os dados climáticos.";
  } finally {
    isLoading.value = false;
  }
}

// Função para lidar com pressionamento de tecla (para pesquisar ao pressionar Enter)
function handleKeyPress(event) {
  if (event.key === "Enter") {
    searchWeather();
  }
}

// Função para pesquisar o clima
function searchWeather() {
  if (cityName.value) {
    fetchWeather(cityName.value.toLocaleLowerCase());
  }
}

</script>

<style scoped>
.neuphormDark {
  box-shadow: inset 9.91px 9.91px 15px #111111, inset -9.91px -9.91px 15px #151515;
}

.neuphormLight {
  box-shadow: inset 9.91px 9.91px 15px #0891b2, inset -9.91px -9.91px 15px #0e7490;
}
</style>
