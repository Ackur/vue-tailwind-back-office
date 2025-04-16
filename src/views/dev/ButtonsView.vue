<template>
  <div class="grid grid-cols-8 gap-4 max-w-5xl">
    <!-- COLORS -->
    <AppButton> primary </AppButton>
    <AppButton color="secondary"> secondary </AppButton>
    <AppButton color="success"> success </AppButton>
    <AppButton color="warning"> warning </AppButton>
    <AppButton color="danger"> danger </AppButton>
    <AppButton color="info"> info </AppButton>
    <AppButton color="dark"> dark </AppButton>
    <AppButton color="light"> light </AppButton>

    <!--  size="lg" -->
    <AppButton size="lg"> size lg </AppButton>
    <AppButton size="lg" color="secondary"> size lg </AppButton>
    <AppButton size="lg" color="success"> size lg </AppButton>
    <AppButton size="lg" color="warning"> size lg </AppButton>
    <AppButton size="lg" color="danger"> size lg </AppButton>
    <AppButton size="lg" color="info"> size lg </AppButton>
    <AppButton size="lg" color="dark"> size lg </AppButton>
    <AppButton size="lg" color="light"> size lg </AppButton>

    <!--  size="sm" -->
    <AppButton size="sm"> size sm </AppButton>
    <AppButton size="sm" color="secondary"> size sm </AppButton>
    <AppButton size="sm" color="success"> size sm </AppButton>
    <AppButton size="sm" color="warning"> size sm </AppButton>
    <AppButton size="sm" color="danger"> size sm </AppButton>
    <AppButton size="sm" color="info"> size sm </AppButton>
    <AppButton size="sm" color="dark"> size sm </AppButton>
    <AppButton size="sm" color="light"> size sm </AppButton>

    <!--  LIGHT -->
    <AppButton light> light </AppButton>
    <AppButton light color="secondary"> light </AppButton>
    <AppButton light color="success"> light </AppButton>
    <AppButton light color="warning"> light </AppButton>
    <AppButton light color="danger"> light </AppButton>
    <AppButton light color="info"> light </AppButton>
    <AppButton light color="dark"> light </AppButton>
    <AppButton light color="light"> light </AppButton>

    <!--  OUTLINE -->
    <AppButton outline> outline </AppButton>
    <AppButton outline color="secondary"> outline </AppButton>
    <AppButton outline color="success"> outline </AppButton>
    <AppButton outline color="warning"> outline </AppButton>
    <AppButton outline color="danger"> outline </AppButton>
    <AppButton outline color="info"> outline </AppButton>
    <AppButton outline color="dark"> outline </AppButton>
    <AppButton outline color="light"> outline </AppButton>

    <!--  OUTLINE + LIGHT -->
    <AppButton outline light> outline </AppButton>
    <AppButton outline light color="secondary"> outline </AppButton>
    <AppButton outline light color="success"> outline </AppButton>
    <AppButton outline light color="warning"> outline </AppButton>
    <AppButton outline light color="danger"> outline </AppButton>
    <AppButton outline light color="info"> outline </AppButton>
    <AppButton outline light color="dark"> outline </AppButton>
    <AppButton outline light color="light"> outline </AppButton>

    <!--  TEXT -->
    <AppButton text> text </AppButton>
    <AppButton text color="secondary"> text </AppButton>
    <AppButton text color="success"> text </AppButton>
    <AppButton text color="warning"> text </AppButton>
    <AppButton text color="danger"> text </AppButton>
    <AppButton text color="info"> text </AppButton>
    <AppButton text color="dark"> text </AppButton>
    <AppButton text color="light"> text </AppButton>

    <!--  LEFT-ICON -->
    <AppButton left-icon="/media/icons/question-circle-icon.svg"> icon </AppButton>
    <AppButton left-icon="/media/icons/question-circle-icon.svg" color="secondary">
      icon
    </AppButton>
    <AppButton left-icon="/media/icons/tags-icon.svg" color="success"> icon </AppButton>
    <AppButton left-icon="/media/icons/question-circle-icon.svg" color="warning">
      icon
    </AppButton>
    <AppButton left-icon="/media/icons/question-circle-icon.svg" color="danger">
      icon
    </AppButton>
    <AppButton left-icon="/media/icons/question-circle-icon.svg" color="info">
      icon
    </AppButton>
    <AppButton color="dark">
      <template #left-icon>
        <InlineSvg
          src="/media/icons/question-circle-icon.svg"
          class="[&_path]:fill-white [&_circle]:fill-white"
        />
      </template>
      icon
    </AppButton>
    <AppButton left-icon="/media/icons/question-circle-icon.svg" color="light">
      icon
    </AppButton>

    <!--  OUTLINE AND RIGHT-ICON -->
    <AppButton outline right-icon="/media/icons/question-circle-icon.svg">
      icon
    </AppButton>
    <AppButton
      outline
      right-icon="/media/icons/question-circle-icon.svg"
      color="secondary"
    >
      icon
    </AppButton>
    <AppButton outline right-icon="/media/icons/tags-icon.svg" color="success">
      icon
    </AppButton>
    <AppButton outline right-icon="/media/icons/question-circle-icon.svg" color="warning">
      icon
    </AppButton>
    <AppButton outline right-icon="/media/icons/question-circle-icon.svg" color="danger">
      icon
    </AppButton>
    <AppButton outline right-icon="/media/icons/question-circle-icon.svg" color="info">
      icon
    </AppButton>
    <AppButton outline color="dark">
      <template #right-icon>
        <InlineSvg src="/media/icons/question-circle-icon.svg" />
      </template>
      icon
    </AppButton>
    <AppButton outline right-icon="/media/icons/question-circle-icon.svg" color="light">
      icon
    </AppButton>

    <!--  SOLO-ICON -->
    <AppButton icon left-icon="/media/icons/question-circle-icon.svg"></AppButton>
    <AppButton
      icon
      left-icon="/media/icons/question-circle-icon.svg"
      color="secondary"
    ></AppButton>
    <AppButton icon left-icon="/media/icons/tags-icon.svg" color="success"></AppButton>
    <AppButton icon left-icon="/media/icons/question-circle-icon.svg" color="warning">
    </AppButton>
    <AppButton icon left-icon="/media/icons/question-circle-icon.svg" color="danger">
    </AppButton>
    <AppButton icon left-icon="/media/icons/question-circle-icon.svg" color="info">
    </AppButton>
    <AppButton icon color="dark">
      <template #left-icon>
        <InlineSvg
          src="/media/icons/question-circle-icon.svg"
          class="[&_path]:fill-white [&_circle]:fill-white"
        />
      </template>
    </AppButton>
    <AppButton icon left-icon="/media/icons/question-circle-icon.svg" color="light">
    </AppButton>

    <!--  SOLO-ICON + LIGHT -->
    <AppButton light icon left-icon="/media/icons/question-circle-icon.svg"></AppButton>
    <AppButton light icon left-icon="/media/icons/question-circle-icon.svg"></AppButton>
    <AppButton
      light
      icon
      left-icon="/media/icons/tags-icon.svg"
      color="success"
    ></AppButton>
    <AppButton
      light
      icon
      left-icon="/media/icons/question-circle-icon.svg"
      color="warning"
    >
    </AppButton>
    <AppButton
      light
      icon
      left-icon="/media/icons/question-circle-icon.svg"
      color="danger"
    >
    </AppButton>
    <AppButton light icon left-icon="/media/icons/question-circle-icon.svg" color="info">
    </AppButton>
    <AppButton light icon color="dark">
      <template #left-icon>
        <InlineSvg src="/media/icons/question-circle-icon.svg" />
      </template>
    </AppButton>
    <AppButton light icon left-icon="/media/icons/question-circle-icon.svg" color="light">
    </AppButton>

    <!--  ACTIVE HOVER BG TEXT COLOR -->
    <AppButton color="light" active-color="danger" class="col-span-2">
      active-color
    </AppButton>
    <AppButton color="light" hover-color="success" class="col-span-2">
      hover-color
    </AppButton>
    <AppButton color="light" active-text-color="primary" class="col-span-2">
      active-text-color
    </AppButton>
    <AppButton color="light" hover-text-color="warning" class="col-span-2">
      hover-text-color
    </AppButton>

    <!--  LOADING -->
    <AppButton loading> primary </AppButton>
    <AppButton color="secondary" loading> secondary </AppButton>
    <AppButton color="success" loading> success </AppButton>
    <AppButton color="warning" loading> warning </AppButton>
    <AppButton color="danger" loading> danger </AppButton>
    <AppButton color="info" loading> info </AppButton>
    <AppButton color="dark" loading> dark </AppButton>
    <AppButton color="light" loading> light </AppButton>

    <!--  disabled -->
    <AppButton disabled> disabled </AppButton>
    <AppButton color="secondary" disabled> disabled </AppButton>
    <AppButton color="success" disabled> disabled </AppButton>
    <AppButton color="warning" disabled> disabled </AppButton>
    <AppButton color="danger" disabled> disabled </AppButton>
    <AppButton color="info" disabled> disabled </AppButton>
    <AppButton color="dark" disabled> disabled </AppButton>
    <AppButton color="light" disabled> disabled </AppButton>
  </div>
</template>

<script setup>
import InlineSvg from "vue-inline-svg";
import AppButton from "../../components/ui/app-button/AppButton.vue";
</script>
