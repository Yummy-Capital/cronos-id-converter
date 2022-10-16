<!-- eslint-disable no-empty -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import LinkableAddress from "./components/LinkableAddress.vue";
import { EnsService } from "./helpers/ens.service";

const service = new EnsService();
const loading = ref(false);
const name = ref("web3developer.cro");

const resolver = ref("");
const owner = ref("");
const address = ref("");
const lookup = ref("");

const fetch = async () => {
  loading.value = true;
  resolver.value = "";
  owner.value = "";
  address.value = "";
  lookup.value = "";

  await Promise.allSettled([
    service.getResolver(name.value),
    service.resolveOwner(name.value),
    service.resolveName(name.value),
  ]).then(([a, b, c]) => {
    if (a.status === "fulfilled") {
      resolver.value = a.value ?? "";
    }

    if (b.status === "fulfilled") {
      owner.value = b.value ?? "";
    }

    if (c.status === "fulfilled") {
      address.value = c.value ?? "";
    }
  });

  if (address.value) {
    await service
      .lookupAddress(address.value)
      .then((x) => (lookup.value = x ?? ""))
      .catch(() => void 0);
  }

  loading.value = false;
};

onMounted(() => void fetch());
</script>

<template>
  <div>
    <p>Enter your Cronos ID</p>
    <input class="x" style="width: 100%" v-model="name" />
    <br />
    <button class="x" :disabled="loading" @click="void fetch()">
      {{ loading ? "Loading..." : "Fetch" }}
    </button>
  </div>

  <div v-if="!loading">
    <p>Resolver: <linkable-address :address="resolver" /></p>
    <p>Owner: <linkable-address :address="owner" /></p>
    <p>Address: <linkable-address :address="address" /></p>
    <p>Lookup: {{ lookup || "❌" }}</p>
  </div>

  <hr style="margin: 10px 0" />
  <a target="_blank" href="https://yummy.capital/">Yummy Capital</a>
</template>

<style scope>
.x {
  margin: 5px 0;
  padding: 10px;
}

.y {
  margin-left: 10px;
}
</style>
