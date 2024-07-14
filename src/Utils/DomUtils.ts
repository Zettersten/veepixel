const componentManifest: { [key: string]: HTMLElement } = {};

export const renderFragment = (element: JSX.Element | string) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = element.toString();
    const result = wrapper.firstChild as HTMLElement;
    componentManifest[result.id] = result;
    return result;
}

export const getManifest = () => componentManifest;