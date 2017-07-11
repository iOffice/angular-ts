/// <reference types="angular" />
import { Injectable, IOnChangesObject } from 'angular';
/**
 * Valid properties to make an angularJS component. The `controller` property has been removed
 * since we are trying to wrap a component to make it look more like an Angular component.
 */
interface INgComponentOptions {
    selector: string;
    template?: string | Injectable<(...args: any[]) => string>;
    templateUrl?: string | Injectable<(...args: any[]) => string>;
    bindings?: {
        [boundProperty: string]: string;
    };
    transclude?: boolean | {
        [slot: string]: string;
    };
    require?: {
        [controller: string]: string;
    };
    controllerAs?: string;
}
/**
 * Decorator to make an angularJS component. See:
 *
 * https://docs.angularjs.org/guide/component
 * https://docs.angularjs.org/api/ng/service/$compile#life-cycle-hooks
 *
 * @param options
 * @return {(target:any)=>undefined}
 * @constructor
 */
declare function NgComponent(options: INgComponentOptions): Function;
/**
 * Called on each controller after all the controllers on an element have been constructed and had
 * their bindings initialized (and before the pre & post linking functions for the directives on
 * this element). This is a good place to put initialization code for your controller.
 *
 * You may wish to inject `$element` to get access to the element.
 */
interface NgOnInit {
    $onInit(): void;
}
/**
 * Called on each turn of the digest cycle. Provides an opportunity to detect and act on changes.
 * Any actions that you wish to take in response to the changes that you detect must be invoked
 * from this hook; implementing this has no effect on when `$onChanges` is called. For example,
 * this hook could be useful if you wish to perform a deep equality check, or to check a `Date`
 * object, changes to which would not be detected by Angular's change detector and thus not trigger
 * `$onChanges`. This hook is invoked with no arguments; if detecting changes, you must store the
 * previous value(s) for comparison to the current values.
 */
interface NgDoCheck {
    $doCheck(): void;
}
/**
 * Called whenever one-way bindings are updated. The onChangesObj is a hash whose keys are the names
 * of the bound properties that have changed, and the values are an {@link IChangesObject} object
 * of the form { currentValue, previousValue, isFirstChange() }. Use this hook to trigger updates
 * within a component such as cloning the bound value to prevent accidental mutation of the outer
 * value.
 */
interface NgOnChanges {
    $onChanges(changes: IOnChangesObject): void;
}
/**
 * Called on a controller when its containing scope is destroyed. Use this hook for releasing
 * external resources, watches and event handlers.
 */
interface NgOnDestroy {
    $onDestroy(): void;
}
/**
 * Called after this controller's element and its children have been linked. Similar to the
 * post-link function this hook can be used to set up DOM event handlers and do direct DOM
 * manipulation. Note that child elements that contain templateUrl directives will not have been
 * compiled and linked since they are waiting for their template to load asynchronously and their
 * own compilation and linking has been suspended until that occurs. This hook can be considered
 * analogous to the ngAfterViewInit and ngAfterContentInit hooks in Angular 2. Since the compilation
 * process is rather different in Angular 1 there is no direct mapping and care should be taken when
 * upgrading.
 */
interface NgPostLink {
    $postLink(): void;
}
export { INgComponentOptions, NgComponent, NgOnInit, NgDoCheck, NgOnChanges, NgOnDestroy, NgPostLink };
