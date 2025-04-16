<script setup></script>

<template>
  <div>
    <table class="w-full border-collapse border-none">
      <thead class="h-10 bg-slate-100">
        <tr class="text-left font-semibold text-sm">
          <th class="pl-8">header 1</th>
          <th>header 2</th>
          <th>header 3</th>
          <th>header 4</th>
          <th>header 5</th>
          <th class="pr-8">header 6</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="num in 10" :key="num" class="text-sm [&:last-child_td>div]:border-b-0">
          <!-- //class="last:[_td_div]:border-b-0" -->
          <td class="py-0 pl-8">
            <div class="h-12 w-full inline-flex items-center border-b">The table body</div>
          </td>
          <td class="py-0">
            <div class="h-12 w-full inline-flex items-center border-b">The table body</div>
          </td>
          <td class="py-0">
            <div class="h-12 w-full inline-flex items-center border-b">The table body</div>
          </td>
          <td class="py-0">
            <div class="h-12 w-full inline-flex items-center border-b">The table body</div>
          </td>
          <td class="py-0">
            <div class="h-12 w-full inline-flex items-center border-b">The table body</div>
          </td>
          <td class="py-0 pr-8">
            <div class="h-12 w-full inline-flex items-center border-b">The table body</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
