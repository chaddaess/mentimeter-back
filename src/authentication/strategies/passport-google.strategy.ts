import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: '1005175455937-q6kqouo7r74tvsr5g5gv6d91ggm7kdfn.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/authentication/success',
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { emails,id } = profile
    const user = {
      email: emails[0].value,
      id:id,
      accessToken
    }
    done(null, user);
  }
}