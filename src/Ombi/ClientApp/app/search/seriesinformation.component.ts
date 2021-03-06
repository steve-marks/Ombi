﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import "rxjs/add/operator/takeUntil";

import { SearchService } from '../services/search.service';
import { RequestService } from '../services/request.service';
import { NotificationService } from '../services/notification.service';

import { ISearchTvResult } from '../interfaces/ISearchTvResult';
import { IRequestEngineResult } from '../interfaces/IRequestEngineResult';
import { IEpisodesRequests } from "../interfaces/IRequestModel";

@Component({
    templateUrl: './seriesinformation.component.html', 
    styleUrls: ['./seriesinformation.component.scss']
})
export class SeriesInformationComponent implements OnInit, OnDestroy {

    constructor(private searchService: SearchService, private route: ActivatedRoute,
        private requestService: RequestService, private notificationService: NotificationService) {
        this.route.params
            .takeUntil(this.subscriptions)
            .subscribe(params => {
                this.seriesId = +params['id']; // (+) converts string 'id' to a number
            });
    }

    private subscriptions = new Subject<void>();

    public result : IRequestEngineResult;
    private seriesId: number;
    public series: ISearchTvResult;

    requestedEpisodes: IEpisodesRequests[] = [];


    ngOnInit(): void {
        this.searchService.getShowInformation(this.seriesId)
            .takeUntil(this.subscriptions)
            .subscribe(x => {
                this.series = x;
            });
    }


    public submitRequests() {
        this.series.requested = true;
        
        this.requestService.requestTv(this.series)
            .takeUntil(this.subscriptions)
            .subscribe(x => {
                this.result = x as IRequestEngineResult;
                if (this.result.requestAdded) {
                    this.notificationService.success("Request Added",
                        `Request for ${this.series.title} has been added successfully`);
                } else {
                    this.notificationService.warning("Request Added", this.result.message);
                }
            });
    }

    public addRequest(episode: IEpisodesRequests) {
        episode.requested = true;
    }


    ngOnDestroy(): void {
        this.subscriptions.next();
        this.subscriptions.complete();
    }
}