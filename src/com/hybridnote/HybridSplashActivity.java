package com.hybridnote;

import android.content.Intent;

import com.karura.framework.ui.SplashActivity;

public class HybridSplashActivity extends SplashActivity {

	@Override
	protected Intent getNextIntent() {
		return new Intent(this, HybridActivity.class);
	}

}
