import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import { CamfilCustomerRegistrationType } from '../../../models/camfil-customer/camfil-customer.model';

import { camfilCreateUser } from './camfil-user.actions';
import { createUserFail, loginUser } from './user.actions';
import {CamfilUserService} from "ish-core/services/user/camfil-user.service";

@Injectable()
export class CamfilUserEffects {
  constructor(private actions$: Actions, private userService: CamfilUserService) {}

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(camfilCreateUser),
      mapToPayload(),
      mergeMap((data: CamfilCustomerRegistrationType) =>
        this.userService.createUser(data).pipe(
          // TODO:see #IS-22750 - user should actually be logged in after registration
          map(() => loginUser({ credentials: { login: data.email, password: '' } })),
          mapErrorToAction(createUserFail)
        )
      )
    )
  );
}
